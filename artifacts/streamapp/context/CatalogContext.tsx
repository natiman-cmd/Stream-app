import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { MOVIES, type Movie } from "@/data/movies";

const STORAGE_KEY = "@streamapp/catalog";

interface CatalogContextValue {
  movies: Movie[];
  isLoading: boolean;
  addMovie: (movie: Movie) => void;
  updateMovie: (movie: Movie) => void;
  deleteMovie: (id: string) => void;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

function persistMovies(movies: Movie[]) {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>(MOVIES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            const saved = JSON.parse(raw) as Movie[];
            if (Array.isArray(saved)) setMovies(saved);
          } catch {
            // Keep the built-in catalog if local data is corrupted.
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const addMovie = useCallback((movie: Movie) => {
    setMovies((previous) => {
      const next = [...previous, movie];
      persistMovies(next);
      return next;
    });
  }, []);

  const updateMovie = useCallback((movie: Movie) => {
    setMovies((previous) => {
      const next = previous.map((item) => (item.id === movie.id ? movie : item));
      persistMovies(next);
      return next;
    });
  }, []);

  const deleteMovie = useCallback((id: string) => {
    setMovies((previous) => {
      const next = previous.filter((movie) => movie.id !== id);
      persistMovies(next);
      return next;
    });
  }, []);

  return (
    <CatalogContext.Provider
      value={{ movies, isLoading, addMovie, updateMovie, deleteMovie }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error("useCatalog must be used inside CatalogProvider");
  return context;
}