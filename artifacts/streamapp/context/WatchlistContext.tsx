import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { MOVIES, type Movie } from "@/data/movies";

const STORAGE_KEY = "@streamapp/watchlist";

interface WatchlistContextValue {
  watchlist: Movie[];
  isInWatchlist: (id: string) => boolean;
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (id: string) => void;
  toggleWatchlist: (movie: Movie) => void;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const ids = JSON.parse(raw) as string[];
          setWatchlistIds(ids);
        } catch {
          // ignore corrupt data
        }
      }
    });
  }, []);

  const persist = useCallback((ids: string[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, []);

  const addToWatchlist = useCallback(
    (movie: Movie) => {
      setWatchlistIds((prev) => {
        if (prev.includes(movie.id)) return prev;
        const next = [...prev, movie.id];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const removeFromWatchlist = useCallback(
    (id: string) => {
      setWatchlistIds((prev) => {
        const next = prev.filter((i) => i !== id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const toggleWatchlist = useCallback(
    (movie: Movie) => {
      setWatchlistIds((prev) => {
        const next = prev.includes(movie.id)
          ? prev.filter((i) => i !== movie.id)
          : [...prev, movie.id];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const isInWatchlist = useCallback(
    (id: string) => watchlistIds.includes(id),
    [watchlistIds]
  );

  const watchlist = watchlistIds
    .map((id) => MOVIES.find((m) => m.id === id))
    .filter((m): m is Movie => m !== undefined);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        isInWatchlist,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used inside WatchlistProvider");
  return ctx;
}
