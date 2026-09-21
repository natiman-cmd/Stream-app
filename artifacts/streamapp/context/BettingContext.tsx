import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { Match, MatchMarket } from "@/data/matches";

const STORAGE_KEY = "@nudrub-bet/state";
const STARTING_BALANCE = 10000;

export interface BetSelection {
  id: string;
  matchId: string;
  matchName: string;
  league: string;
  selection: string;
  odds: number;
}

export interface SettledBet {
  id: string;
  selections: BetSelection[];
  stake: number;
  potentialReturn: number;
  createdAt: string;
  status: "demo-pending";
}

interface SavedState {
  balance?: number;
  slip?: BetSelection[];
  history?: SettledBet[];
}

interface BettingContextValue {
  balance: number;
  slip: BetSelection[];
  history: SettledBet[];
  totalOdds: number;
  potentialReturn: number;
  isSelected: (matchId: string, marketId: string) => boolean;
  toggleSelection: (match: Match, market: MatchMarket) => void;
  removeSelection: (selectionId: string) => void;
  setStake: (value: number) => void;
  placeDemoBet: (stake: number) => { ok: true; bet: SettledBet } | { ok: false; error: string };
  clearSlip: () => void;
}

const BettingContext = createContext<BettingContextValue | null>(null);

function persist(balance: number, slip: BetSelection[], history: SettledBet[]) {
  void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ balance, slip, history }));
}

export function BettingProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [slip, setSlip] = useState<BetSelection[]>([]);
  const [history, setHistory] = useState<SettledBet[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return;
      try {
        const saved = JSON.parse(raw) as SavedState;
        if (typeof saved.balance === "number") setBalance(saved.balance);
        if (Array.isArray(saved.slip)) setSlip(saved.slip);
        if (Array.isArray(saved.history)) setHistory(saved.history);
      } catch {
        // Use a fresh demo wallet if local state cannot be parsed.
      }
    });
  }, []);

  const toggleSelection = useCallback((match: Match, market: MatchMarket) => {
    setSlip((previous) => {
      const selectionId = `${match.id}:${market.id}`;
      const exists = previous.some((selection) => selection.id === selectionId);
      const next = exists
        ? previous.filter((selection) => selection.id !== selectionId)
        : [
            ...previous.filter((selection) => selection.matchId !== match.id),
            {
              id: selectionId,
              matchId: match.id,
              matchName: `${match.home} · ${match.away}`,
              league: match.league,
              selection: market.label,
              odds: market.odds,
            },
          ];
      persist(balance, next, history);
      return next;
    });
  }, [balance, history]);

  const removeSelection = useCallback((selectionId: string) => {
    setSlip((previous) => {
      const next = previous.filter((selection) => selection.id !== selectionId);
      persist(balance, next, history);
      return next;
    });
  }, [balance, history]);

  const placeDemoBet = useCallback((stake: number) => {
    if (!slip.length) return { ok: false as const, error: "Add at least one odd to your bet slip." };
    if (!Number.isFinite(stake) || stake < 10) return { ok: false as const, error: "Minimum demo stake is ETB 10." };
    if (stake > balance) return { ok: false as const, error: "Your demo balance is too low for that stake." };
    const potentialReturn = Math.round(stake * slip.reduce((total, item) => total * item.odds, 1) * 100) / 100;
    const bet: SettledBet = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      selections: slip,
      stake,
      potentialReturn,
      createdAt: new Date().toISOString(),
      status: "demo-pending",
    };
    const nextBalance = balance - stake;
    const nextHistory = [bet, ...history].slice(0, 30);
    setBalance(nextBalance);
    setHistory(nextHistory);
    setSlip([]);
    persist(nextBalance, [], nextHistory);
    return { ok: true as const, bet };
  }, [balance, history, slip]);

  const value = useMemo(() => ({
    balance,
    slip,
    history,
    totalOdds: slip.reduce((total, item) => total * item.odds, 1),
    potentialReturn: slip.length ? slip.reduce((total, item) => total * item.odds, 1) : 0,
    isSelected: (matchId: string, marketId: string) => slip.some((selection) => selection.id === `${matchId}:${marketId}`),
    toggleSelection,
    removeSelection,
    setStake: (_value: number) => undefined,
    placeDemoBet,
    clearSlip: () => {
      setSlip([]);
      persist(balance, [], history);
    },
  }), [balance, slip, history, toggleSelection, removeSelection, placeDemoBet]);

  return <BettingContext.Provider value={value}>{children}</BettingContext.Provider>;
}

export function useBetting() {
  const context = useContext(BettingContext);
  if (!context) throw new Error("useBetting must be used inside BettingProvider");
  return context;
}

export { STARTING_BALANCE };