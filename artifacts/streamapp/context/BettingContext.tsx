import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { apiFetch } from "@/lib/api";
import { Match, MatchMarket } from "@/data/matches";

const SLIP_STORAGE_KEY = "@nudrub-bet/slip";
const PLAYER_STORAGE_KEY = "@nudrub-bet/player-id";

export interface BetSelection {
  id: string;
  matchId: string;
  matchName: string;
  league: string;
  selection: string;
  odds: number;
}

export interface WalletTransaction {
  id: string;
  type: string;
  direction: string;
  amountCents: number;
  status: string;
  reference?: string | null;
  createdAt: string;
}

export interface SettledBet {
  id: string;
  selections: BetSelection[];
  stake: number;
  potentialReturn: number;
  createdAt: string;
  status: "pending";
}

interface WalletResponse {
  balanceCents: number;
  lockedCents: number;
  availableCents: number;
}

interface BettingContextValue {
  balance: number;
  availableBalance: number;
  lockedBalance: number;
  playerId: string | null;
  slip: BetSelection[];
  history: SettledBet[];
  transactions: WalletTransaction[];
  walletLoading: boolean;
  walletError: string | null;
  totalOdds: number;
  potentialReturn: number;
  isSelected: (matchId: string, marketId: string) => boolean;
  toggleSelection: (match: Match, market: MatchMarket) => void;
  removeSelection: (selectionId: string) => void;
  placeDemoBet: (stake: number) => Promise<{ ok: true } | { ok: false; error: string }>;
  clearSlip: () => void;
  refreshWallet: () => Promise<void>;
}

const BettingContext = createContext<BettingContextValue | null>(null);

function createPlayerId() {
  return `plr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

export function BettingProvider({ children }: { children: React.ReactNode }) {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [balanceCents, setBalanceCents] = useState(0);
  const [lockedCents, setLockedCents] = useState(0);
  const [slip, setSlip] = useState<BetSelection[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [history] = useState<SettledBet[]>([]);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(PLAYER_STORAGE_KEY),
      AsyncStorage.getItem(SLIP_STORAGE_KEY),
    ]).then(([savedPlayerId, savedSlip]) => {
      const nextPlayerId = savedPlayerId ?? createPlayerId();
      setPlayerId(nextPlayerId);
      if (!savedPlayerId) void AsyncStorage.setItem(PLAYER_STORAGE_KEY, nextPlayerId);
      if (savedSlip) {
        try {
          setSlip(JSON.parse(savedSlip) as BetSelection[]);
        } catch {
          void AsyncStorage.removeItem(SLIP_STORAGE_KEY);
        }
      }
    });
  }, []);

  const refreshWallet = useCallback(async () => {
    if (!playerId) return;
    setWalletLoading(true);
    try {
      const [wallet, transactionResponse] = await Promise.all([
        apiFetch<WalletResponse>(`/api/wallet/${playerId}`),
        apiFetch<{ transactions: WalletTransaction[] }>(`/api/wallet/${playerId}/transactions`),
      ]);
      setBalanceCents(wallet.balanceCents);
      setLockedCents(wallet.lockedCents);
      setTransactions(transactionResponse.transactions);
      setWalletError(null);
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : "Wallet is unavailable.");
    } finally {
      setWalletLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    void refreshWallet();
  }, [refreshWallet]);

  const persistSlip = (next: BetSelection[]) => {
    setSlip(next);
    void AsyncStorage.setItem(SLIP_STORAGE_KEY, JSON.stringify(next));
  };

  const toggleSelection = useCallback((match: Match, market: MatchMarket) => {
    const selectionId = `${match.id}:${market.id}`;
    const exists = slip.some((selection) => selection.id === selectionId);
    const next = exists
      ? slip.filter((selection) => selection.id !== selectionId)
      : [
          ...slip.filter((selection) => selection.matchId !== match.id),
          {
            id: selectionId,
            matchId: match.id,
            matchName: `${match.home} · ${match.away}`,
            league: match.league,
            selection: market.label,
            odds: market.odds,
          },
        ];
    persistSlip(next);
  }, [slip]);

  const removeSelection = useCallback((selectionId: string) => {
    persistSlip(slip.filter((selection) => selection.id !== selectionId));
  }, [slip]);

  const placeDemoBet = useCallback(async (stake: number) => {
    if (!playerId) return { ok: false as const, error: "Wallet is still loading." };
    if (!slip.length) return { ok: false as const, error: "Add at least one odd to your bet slip." };
    if (!Number.isFinite(stake) || stake < 10) return { ok: false as const, error: "Minimum stake is ETB 10." };
    try {
      await apiFetch(`/api/wallet/${playerId}/bets`, {
        method: "POST",
        body: JSON.stringify({
          amountCents: Math.round(stake * 100),
          selections: slip,
        }),
      });
      persistSlip([]);
      await refreshWallet();
      return { ok: true as const };
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : "Wager could not be placed." };
    }
  }, [playerId, refreshWallet, slip]);

  const value = useMemo(() => ({
    balance: balanceCents / 100,
    availableBalance: (balanceCents - lockedCents) / 100,
    lockedBalance: lockedCents / 100,
    playerId,
    slip,
    history,
    transactions,
    walletLoading,
    walletError,
    totalOdds: slip.reduce((total, item) => total * item.odds, 1),
    potentialReturn: slip.length ? slip.reduce((total, item) => total * item.odds, 1) : 0,
    isSelected: (matchId: string, marketId: string) => slip.some((selection) => selection.id === `${matchId}:${marketId}`),
    toggleSelection,
    removeSelection,
    placeDemoBet,
    clearSlip: () => persistSlip([]),
    refreshWallet,
  }), [balanceCents, lockedCents, playerId, slip, history, transactions, walletLoading, walletError, toggleSelection, removeSelection, placeDemoBet, refreshWallet]);

  return <BettingContext.Provider value={value}>{children}</BettingContext.Provider>;
}

export function useBetting() {
  const context = useContext(BettingContext);
  if (!context) throw new Error("useBetting must be used inside BettingProvider");
  return context;
}