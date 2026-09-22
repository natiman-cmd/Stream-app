import { randomUUID } from "node:crypto";

import { and, desc, eq, sql } from "drizzle-orm";
import { Router, type IRouter, type Request, type Response } from "express";

import {
  db,
  paymentRequests,
  walletAccounts,
  walletTransactions,
} from "@workspace/db";

const router: IRouter = Router();
const PLAYER_ID_PATTERN = /^[A-Za-z0-9_-]{8,80}$/;
const MAX_RECEIPT_DATA_LENGTH = 3_500_000;
const MIN_AMOUNT_CENTS = 100;

type PaymentType = "deposit" | "withdrawal";
type PaymentMethod = "telebirr" | "bank";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown, maxLength = 180) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength ? trimmed : undefined;
}

function playerIdValue(value: unknown) {
  const playerId = stringValue(value, 80);
  return playerId && PLAYER_ID_PATTERN.test(playerId) ? playerId : undefined;
}

function amountValue(value: unknown) {
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isInteger(amount) && amount >= MIN_AMOUNT_CENTS && amount <= 50_000_000 ? amount : undefined;
}

function paymentMethodValue(value: unknown): PaymentMethod | undefined {
  return value === "telebirr" || value === "bank" ? value : undefined;
}

function serializeWallet(wallet: typeof walletAccounts.$inferSelect) {
  return {
    id: wallet.id,
    playerId: wallet.playerId,
    currency: wallet.currency,
    balanceCents: wallet.balanceCents,
    lockedCents: wallet.lockedCents,
    availableCents: wallet.balanceCents - wallet.lockedCents,
    updatedAt: wallet.updatedAt,
  };
}

async function getOrCreateWallet(playerId: string) {
  await db
    .insert(walletAccounts)
    .values({ id: randomUUID(), playerId })
    .onConflictDoNothing({ target: walletAccounts.playerId });
  const wallet = await db.query.walletAccounts.findFirst({
    where: eq(walletAccounts.playerId, playerId),
  });
  if (!wallet) throw new Error("Wallet could not be created");
  return wallet;
}

function requireAdmin(req: Request, res: Response) {
  const expected = process.env.ADMIN_REVIEW_TOKEN;
  if (!expected) {
    res.status(503).json({ error: "Admin review is not configured." });
    return false;
  }
  if (req.header("x-admin-token") !== expected) {
    res.status(401).json({ error: "Admin authorization required." });
    return false;
  }
  return true;
}

router.get("/payments/instructions", (_req, res) => {
  res.json({
    currency: "ETB",
    telebirr: {
      phoneNumber: process.env.MANUAL_TELEBIRR_NUMBER ?? "",
      accountName: process.env.MANUAL_TELEBIRR_NAME ?? "",
    },
    bank: {
      bankName: process.env.MANUAL_BANK_NAME ?? "",
      accountName: process.env.MANUAL_BANK_ACCOUNT_NAME ?? "",
      accountNumber: process.env.MANUAL_BANK_ACCOUNT_NUMBER ?? "",
    },
    note: process.env.MANUAL_PAYMENT_NOTE ?? "Send the exact amount, then submit your reference and receipt for manual review.",
  });
});

router.get("/wallet/:playerId", async (req, res) => {
  const playerId = playerIdValue(req.params.playerId);
  if (!playerId) {
    res.status(400).json({ error: "Invalid player id." });
    return;
  }
  try {
    const wallet = await getOrCreateWallet(playerId);
    res.json(serializeWallet(wallet));
  } catch (error) {
    req.log.error({ err: error }, "Unable to load wallet");
    res.status(500).json({ error: "Unable to load wallet." });
  }
});

router.get("/wallet/:playerId/transactions", async (req, res) => {
  const playerId = playerIdValue(req.params.playerId);
  if (!playerId) {
    res.status(400).json({ error: "Invalid player id." });
    return;
  }
  try {
    const transactions = await db
      .select()
      .from(walletTransactions)
      .where(eq(walletTransactions.playerId, playerId))
      .orderBy(desc(walletTransactions.createdAt))
      .limit(100);
    res.json({ transactions });
  } catch (error) {
    req.log.error({ err: error }, "Unable to load wallet transactions");
    res.status(500).json({ error: "Unable to load wallet transactions." });
  }
});

router.get("/payments/requests/:playerId", async (req, res) => {
  const playerId = playerIdValue(req.params.playerId);
  if (!playerId) {
    res.status(400).json({ error: "Invalid player id." });
    return;
  }
  try {
    const requests = await db
      .select({
        id: paymentRequests.id,
        type: paymentRequests.type,
        status: paymentRequests.status,
        amountCents: paymentRequests.amountCents,
        paymentMethod: paymentRequests.paymentMethod,
        reference: paymentRequests.reference,
        payoutPhone: paymentRequests.payoutPhone,
        payoutBankName: paymentRequests.payoutBankName,
        payoutBankAccount: paymentRequests.payoutBankAccount,
        payoutAccountName: paymentRequests.payoutAccountName,
        note: paymentRequests.note,
        reviewNote: paymentRequests.reviewNote,
        createdAt: paymentRequests.createdAt,
        reviewedAt: paymentRequests.reviewedAt,
      })
      .from(paymentRequests)
      .where(eq(paymentRequests.playerId, playerId))
      .orderBy(desc(paymentRequests.createdAt))
      .limit(50);
    res.json({ requests });
  } catch (error) {
    req.log.error({ err: error }, "Unable to load payment requests");
    res.status(500).json({ error: "Unable to load payment requests." });
  }
});

router.post("/payments/deposits", async (req, res) => {
  if (!isRecord(req.body)) {
    res.status(400).json({ error: "Invalid request body." });
    return;
  }
  const playerId = playerIdValue(req.body.playerId);
  const amountCents = amountValue(req.body.amountCents);
  const paymentMethod = paymentMethodValue(req.body.paymentMethod);
  const reference = stringValue(req.body.reference, 120);
  const receiptData = stringValue(req.body.receiptData, MAX_RECEIPT_DATA_LENGTH);
  const receiptFileName = stringValue(req.body.receiptFileName, 160);
  const receiptContentType = stringValue(req.body.receiptContentType, 80);
  const note = stringValue(req.body.note, 500);

  if (!playerId || !amountCents || !paymentMethod || !reference) {
    res.status(400).json({ error: "Player, amount, payment method, and reference are required." });
    return;
  }
  if (receiptData && !receiptData.startsWith("data:")) {
    res.status(400).json({ error: "Receipt data must be a data URL." });
    return;
  }

  try {
    await getOrCreateWallet(playerId);
    const [request] = await db
      .insert(paymentRequests)
      .values({
        id: randomUUID(),
        playerId,
        type: "deposit",
        amountCents,
        paymentMethod,
        reference,
        receiptData,
        receiptFileName,
        receiptContentType,
        note,
      })
      .returning();
    res.status(201).json({ request });
  } catch (error) {
    req.log.error({ err: error }, "Unable to create deposit request");
    res.status(500).json({ error: "Unable to create deposit request." });
  }
});

router.post("/payments/withdrawals", async (req, res) => {
  if (!isRecord(req.body)) {
    res.status(400).json({ error: "Invalid request body." });
    return;
  }
  const playerId = playerIdValue(req.body.playerId);
  const amountCents = amountValue(req.body.amountCents);
  const paymentMethod = paymentMethodValue(req.body.paymentMethod);
  const payoutPhone = stringValue(req.body.payoutPhone, 40);
  const payoutBankName = stringValue(req.body.payoutBankName, 120);
  const payoutBankAccount = stringValue(req.body.payoutBankAccount, 80);
  const payoutAccountName = stringValue(req.body.payoutAccountName, 160);
  const note = stringValue(req.body.note, 500);

  const payoutDetailsValid =
    paymentMethod === "telebirr"
      ? Boolean(payoutPhone)
      : Boolean(payoutBankName && payoutBankAccount && payoutAccountName);

  if (!playerId || !amountCents || !paymentMethod || !payoutDetailsValid) {
    res.status(400).json({ error: "Player, amount, payout method, and payout details are required." });
    return;
  }

  try {
    const [request] = await db.transaction(async (tx) => {
      const wallet = await tx.query.walletAccounts.findFirst({
        where: eq(walletAccounts.playerId, playerId),
      });
      if (!wallet) throw new Error("WALLET_NOT_FOUND");
      const availableCents = wallet.balanceCents - wallet.lockedCents;
      if (availableCents < amountCents) throw new Error("INSUFFICIENT_FUNDS");

      const [updatedWallet] = await tx
        .update(walletAccounts)
        .set({
          lockedCents: wallet.lockedCents + amountCents,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(walletAccounts.id, wallet.id),
            sql`${walletAccounts.balanceCents} - ${walletAccounts.lockedCents} >= ${amountCents}`,
          ),
        )
        .returning();
      if (!updatedWallet) throw new Error("INSUFFICIENT_FUNDS");

      return tx
        .insert(paymentRequests)
        .values({
          id: randomUUID(),
          playerId,
          type: "withdrawal",
          amountCents,
          paymentMethod,
          payoutPhone,
          payoutBankName,
          payoutBankAccount,
          payoutAccountName,
          note,
        })
        .returning();
    });
    res.status(201).json({ request });
  } catch (error) {
    if (error instanceof Error && error.message === "INSUFFICIENT_FUNDS") {
      res.status(409).json({ error: "Insufficient available balance." });
      return;
    }
    req.log.error({ err: error }, "Unable to create withdrawal request");
    res.status(500).json({ error: "Unable to create withdrawal request." });
  }
});

router.post("/wallet/:playerId/bets", async (req, res) => {
  const playerId = playerIdValue(req.params.playerId);
  if (!playerId || !isRecord(req.body)) {
    res.status(400).json({ error: "Invalid wager request." });
    return;
  }
  if (
    process.env.REAL_MONEY_WAGERING_ENABLED !== "true" ||
    process.env.WAGERING_COMPLIANCE_APPROVED !== "true"
  ) {
    res.status(423).json({
      code: "REAL_MONEY_WAGERING_LOCKED",
      error: "Real-money wagering is locked until identity, age, jurisdiction, limits, settlement, and audit controls are configured.",
    });
    return;
  }

  const amountCents = amountValue(req.body.amountCents);
  const selections = Array.isArray(req.body.selections) ? req.body.selections.slice(0, 20) : [];
  if (!amountCents || selections.length === 0) {
    res.status(400).json({ error: "A valid stake and at least one selection are required." });
    return;
  }

  try {
    const result = await db.transaction(async (tx) => {
      const wallet = await tx.query.walletAccounts.findFirst({
        where: eq(walletAccounts.playerId, playerId),
      });
      if (!wallet) throw new Error("WALLET_NOT_FOUND");
      const [updatedWallet] = await tx
        .update(walletAccounts)
        .set({
          balanceCents: wallet.balanceCents - amountCents,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(walletAccounts.id, wallet.id),
            sql`${walletAccounts.balanceCents} - ${walletAccounts.lockedCents} >= ${amountCents}`,
          ),
        )
        .returning();
      if (!updatedWallet) throw new Error("INSUFFICIENT_FUNDS");
      const [transaction] = await tx
        .insert(walletTransactions)
        .values({
          id: randomUUID(),
          walletId: wallet.id,
          playerId,
          type: "wager",
          direction: "debit",
          amountCents,
          status: "posted",
          metadata: { selections },
        })
        .returning();
      return transaction;
    });
    res.status(201).json({ transaction: result });
  } catch (error) {
    if (error instanceof Error && error.message === "INSUFFICIENT_FUNDS") {
      res.status(409).json({ error: "Insufficient available balance." });
      return;
    }
    req.log.error({ err: error }, "Unable to place wager");
    res.status(500).json({ error: "Unable to place wager." });
  }
});

router.get("/admin/payment-requests", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const status = req.query.status;
  try {
    const requests = await db
      .select()
      .from(paymentRequests)
      .where(typeof status === "string" ? eq(paymentRequests.status, status) : undefined)
      .orderBy(desc(paymentRequests.createdAt))
      .limit(200);
    res.json({ requests });
  } catch (error) {
    req.log.error({ err: error }, "Unable to load admin payment requests");
    res.status(500).json({ error: "Unable to load admin payment requests." });
  }
});

router.post("/admin/payment-requests/:id/decision", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  if (!isRecord(req.body)) {
    res.status(400).json({ error: "Invalid request body." });
    return;
  }
  const decision = req.body.decision === "approve" || req.body.decision === "reject" ? req.body.decision : undefined;
  const reviewNote = stringValue(req.body.reviewNote, 500);
  const requestId = stringValue(req.params.id, 80);
  if (!decision || !requestId) {
    res.status(400).json({ error: "Decision is required." });
    return;
  }

  try {
    const result = await db.transaction(async (tx) => {
      const request = await tx.query.paymentRequests.findFirst({
        where: eq(paymentRequests.id, requestId),
      });
      if (!request) throw new Error("REQUEST_NOT_FOUND");
      if (request.status !== "pending") throw new Error("REQUEST_ALREADY_REVIEWED");

      const wallet = await tx.query.walletAccounts.findFirst({
        where: eq(walletAccounts.playerId, request.playerId),
      });
      if (!wallet) throw new Error("WALLET_NOT_FOUND");

      if (request.type === "deposit" && decision === "approve") {
        await tx
          .update(walletAccounts)
          .set({
            balanceCents: wallet.balanceCents + request.amountCents,
            updatedAt: new Date(),
          })
          .where(eq(walletAccounts.id, wallet.id));
        await tx.insert(walletTransactions).values({
          id: randomUUID(),
          walletId: wallet.id,
          playerId: request.playerId,
          type: "manual_deposit",
          direction: "credit",
          amountCents: request.amountCents,
          status: "posted",
          reference: request.reference,
          metadata: { paymentRequestId: request.id, paymentMethod: request.paymentMethod },
        });
      }

      if (request.type === "withdrawal") {
        if (decision === "approve") {
          if (wallet.lockedCents < request.amountCents || wallet.balanceCents < request.amountCents) {
            throw new Error("INSUFFICIENT_FUNDS");
          }
          await tx
            .update(walletAccounts)
            .set({
              balanceCents: wallet.balanceCents - request.amountCents,
              lockedCents: wallet.lockedCents - request.amountCents,
              updatedAt: new Date(),
            })
            .where(eq(walletAccounts.id, wallet.id));
          await tx.insert(walletTransactions).values({
            id: randomUUID(),
            walletId: wallet.id,
            playerId: request.playerId,
            type: "manual_withdrawal",
            direction: "debit",
            amountCents: request.amountCents,
            status: "posted",
            metadata: { paymentRequestId: request.id, paymentMethod: request.paymentMethod },
          });
        } else {
          await tx
            .update(walletAccounts)
            .set({
              lockedCents: wallet.lockedCents - request.amountCents,
              updatedAt: new Date(),
            })
            .where(eq(walletAccounts.id, wallet.id));
        }
      }

      const [updatedRequest] = await tx
        .update(paymentRequests)
        .set({
          status: decision === "approve" ? "approved" : "rejected",
          reviewNote,
          reviewedBy: "manual-admin",
          reviewedAt: new Date(),
        })
        .where(eq(paymentRequests.id, request.id))
        .returning();
      return updatedRequest;
    });
    res.json({ request: result });
  } catch (error) {
    if (error instanceof Error && error.message === "REQUEST_NOT_FOUND") {
      res.status(404).json({ error: "Payment request not found." });
      return;
    }
    if (error instanceof Error && error.message === "REQUEST_ALREADY_REVIEWED") {
      res.status(409).json({ error: "Payment request has already been reviewed." });
      return;
    }
    if (error instanceof Error && error.message === "INSUFFICIENT_FUNDS") {
      res.status(409).json({ error: "Withdrawal can no longer be approved because funds are unavailable." });
      return;
    }
    req.log.error({ err: error }, "Unable to review payment request");
    res.status(500).json({ error: "Unable to review payment request." });
  }
});

export default router;