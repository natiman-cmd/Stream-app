import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { CasinoGame, getGame } from "@/data/games";

const STORAGE_KEY = "@streamapp/casino-state";
const STARTING_BALANCE = 1000;
const DAILY_BONUS = 250;

export interface GameRound {
  id: string;
  gameId: string;
  gameTitle: string;
  stake: number;
  choice: string;
  outcome: string;
  won: boolean;
  payout: number;
  balanceAfter: number;
  createdAt: string;
}

interface SavedCasinoState {
  balance?: number;
  rounds?: GameRound[];
  lastBonusAt?: string | null;
}

type PlayResult =
  | { ok: true; round: GameRound }
  | { ok: false; error: string };

interface CasinoContextValue {
  balance: number;
  rounds: GameRound[];
  isLoading: boolean;
  canClaimBonus: boolean;
  totalRounds: number;
  wins: number;
  totalWagered: number;
  claimBonus: () => boolean;
  playRound: (game: CasinoGame, stake: number, choice: string) => PlayResult;
  resetCasino: () => void;
}

const CasinoContext = createContext<CasinoContextValue | null>(null);

function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function makeRoundId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function saveState(balance: number, rounds: GameRound[], lastBonusAt: string | null) {
  void AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ balance, rounds, lastBonusAt }),
  );
}

function resolveOutcome(game: CasinoGame, choice: string) {
  if (game.kind === "coin-flip") {
    const outcome = Math.random() < 0.5 ? "Heads" : "Tails";
    return { outcome, won: choice === outcome, multiplier: 2 };
  }

  if (game.kind === "dice") {
    const total = Math.floor(Math.random() * 11) + 2;
    const outcome = `${total} (${total >= 8 ? "High" : "Low"})`;
    const won = choice === (total >= 8 ? "High" : "Low");
    return { outcome, won, multiplier: 2 };
  }

  if (game.kind === "roulette") {
    const roll = Math.floor(Math.random() * 37);
    const outcome = roll === 0 ? "Green" : roll % 2 === 0 ? "Black" : "Red";
    const won = choice === outcome;
    return { outcome: `${outcome} · ${roll}`, won, multiplier: outcome === "Green" ? 14 : 2 };
  }

  const number = Math.floor(Math.random() * 10) + 1;
  return { outcome: String(number), won: number === 7, multiplier: 8 };
}

export function CasinoProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [rounds, setRounds] = useState<GameRound[]>([]);
  const [lastBonusAt, setLastBonusAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved = JSON.parse(raw) as SavedCasinoState;
          setBalance(typeof saved.balance === "number" ? saved.balance : STARTING_BALANCE);
          setRounds(Array.isArray(saved.rounds) ? saved.rounds : []);
          setLastBonusAt(saved.lastBonusAt ?? null);
        } catch {
          // Revert to a fresh play-money wallet when local state is corrupt.
        }
      }
      setIsLoading(false);
    });
  }, []);

  const canClaimBonus = lastBonusAt !== dayKey();

  const claimBonus = useCallback(() => {
    if (lastBonusAt === dayKey()) return false;
    const nextBalance = balance + DAILY_BONUS;
    const nextDate = dayKey();
    setBalance(nextBalance);
    setLastBonusAt(nextDate);
    saveState(nextBalance, rounds, nextDate);
    return true;
  }, [balance, lastBonusAt, rounds]);

  const playRound = useCallback(
    (game: CasinoGame, rawStake: number, choice: string): PlayResult => {
      const stake = Math.round(rawStake);
      if (!Number.isFinite(stake) || stake < game.minStake || stake > game.maxStake) {
        return { ok: false, error: `Stake between ${game.minStake} and ${game.maxStake} credits.` };
      }
      if (stake > balance) {
        return { ok: false, error: "You do not have enough credits for that round." };
      }
      if (!game.options.includes(choice)) {
        return { ok: false, error: "Choose an option before playing." };
      }

      const result = resolveOutcome(game, choice);
      const payout = result.won ? stake * result.multiplier : 0;
      const nextBalance = balance - stake + payout;
      const round: GameRound = {
        id: makeRoundId(),
        gameId: game.id,
        gameTitle: game.title,
        stake,
        choice,
        outcome: result.outcome,
        won: result.won,
        payout,
        balanceAfter: nextBalance,
        createdAt: new Date().toISOString(),
      };
      const nextRounds = [round, ...rounds].slice(0, 50);

      setBalance(nextBalance);
      setRounds(nextRounds);
      saveState(nextBalance, nextRounds, lastBonusAt);
      return { ok: true, round };
    },
    [balance, lastBonusAt, rounds],
  );

  const resetCasino = useCallback(() => {
    setBalance(STARTING_BALANCE);
    setRounds([]);
    setLastBonusAt(null);
    saveState(STARTING_BALANCE, [], null);
  }, []);

  const value = useMemo(
    () => ({
      balance,
      rounds,
      isLoading,
      canClaimBonus,
      totalRounds: rounds.length,
      wins: rounds.filter((round) => round.won).length,
      totalWagered: rounds.reduce((sum, round) => sum + round.stake, 0),
      claimBonus,
      playRound,
      resetCasino,
    }),
    [balance, rounds, isLoading, canClaimBonus, claimBonus, playRound, resetCasino],
  );

  return <CasinoContext.Provider value={value}>{children}</CasinoContext.Provider>;
}

export function useCasino() {
  const context = useContext(CasinoContext);
  if (!context) throw new Error("useCasino must be used inside CasinoProvider");
  return context;
}

export { DAILY_BONUS, STARTING_BALANCE, getGame };