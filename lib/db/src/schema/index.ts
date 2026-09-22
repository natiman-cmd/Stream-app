// Export your models here. Add one export per file
// export * from "./posts";
//
// Each model/table should ideally be split into different files.
// Each model/table should define a Drizzle table, insert schema, and types:
//
//   import { pgTable, text, serial } from "drizzle-orm/pg-core";
//   import { createInsertSchema } from "drizzle-zod";
//   import { z } from "zod/v4";
//
//   export const postsTable = pgTable("posts", {
//     id: serial("id").primaryKey(),
//     title: text("title").notNull(),
//   });
//
//   export const insertPostSchema = createInsertSchema(postsTable).omit({ id: true });
//   export type InsertPost = z.infer<typeof insertPostSchema>;
//   export type Post = typeof postsTable.$inferSelect;

import { integer, jsonb, pgTable, text, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";

export const walletAccounts = pgTable(
  "wallet_accounts",
  {
    id: text("id").primaryKey(),
    playerId: text("player_id").notNull(),
    currency: text("currency").notNull().default("ETB"),
    balanceCents: integer("balance_cents").notNull().default(0),
    lockedCents: integer("locked_cents").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("wallet_accounts_player_id_idx").on(table.playerId)],
);

export const walletTransactions = pgTable(
  "wallet_transactions",
  {
    id: text("id").primaryKey(),
    walletId: text("wallet_id").notNull(),
    playerId: text("player_id").notNull(),
    type: text("type").notNull(),
    direction: text("direction").notNull(),
    amountCents: integer("amount_cents").notNull(),
    status: text("status").notNull(),
    reference: text("reference"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("wallet_transactions_player_id_idx").on(table.playerId)],
);

export const paymentRequests = pgTable(
  "payment_requests",
  {
    id: text("id").primaryKey(),
    playerId: text("player_id").notNull(),
    type: text("type").notNull(),
    status: text("status").notNull().default("pending"),
    amountCents: integer("amount_cents").notNull(),
    paymentMethod: text("payment_method").notNull(),
    reference: text("reference"),
    receiptObjectPath: text("receipt_object_path"),
    receiptFileName: text("receipt_file_name"),
    receiptContentType: text("receipt_content_type"),
    receiptData: text("receipt_data"),
    payoutPhone: text("payout_phone"),
    payoutBankName: text("payout_bank_name"),
    payoutBankAccount: text("payout_bank_account"),
    payoutAccountName: text("payout_account_name"),
    note: text("note"),
    reviewNote: text("review_note"),
    reviewedBy: text("reviewed_by"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("payment_requests_player_id_idx").on(table.playerId)],
);

export type WalletAccount = typeof walletAccounts.$inferSelect;
export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type PaymentRequest = typeof paymentRequests.$inferSelect;