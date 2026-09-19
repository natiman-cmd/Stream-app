import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { getProperty, Property, PROPERTIES } from "@/data/properties";

const STORAGE_KEY = "@arada-homes/property-state";

interface SavedPropertyState {
  savedIds?: string[];
  inquiries?: string[];
}

interface PropertyContextValue {
  properties: Property[];
  savedProperties: Property[];
  inquiries: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  inquire: (id: string) => void;
  clearSaved: () => void;
}

const PropertyContext = createContext<PropertyContextValue | null>(null);

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [inquiries, setInquiries] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return;
      try {
        const saved = JSON.parse(raw) as SavedPropertyState;
        setSavedIds(Array.isArray(saved.savedIds) ? saved.savedIds : []);
        setInquiries(Array.isArray(saved.inquiries) ? saved.inquiries : []);
      } catch {
        // Start with an empty local state when persisted data is invalid.
      }
    });
  }, []);

  const persist = useCallback((nextSavedIds: string[], nextInquiries: string[]) => {
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ savedIds: nextSavedIds, inquiries: nextInquiries }));
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((previous) => {
      const next = previous.includes(id) ? previous.filter((item) => item !== id) : [id, ...previous];
      persist(next, inquiries);
      return next;
    });
  }, [inquiries, persist]);

  const inquire = useCallback((id: string) => {
    setInquiries((previous) => {
      if (previous.includes(id)) return previous;
      const next = [id, ...previous];
      persist(savedIds, next);
      return next;
    });
  }, [persist, savedIds]);

  const clearSaved = useCallback(() => {
    setSavedIds([]);
    persist([], inquiries);
  }, [inquiries, persist]);

  const value = useMemo(() => ({
    properties: PROPERTIES,
    savedProperties: savedIds.map((id) => getProperty(id)).filter((property): property is Property => Boolean(property)),
    inquiries,
    isSaved: (id: string) => savedIds.includes(id),
    toggleSaved,
    inquire,
    clearSaved,
  }), [savedIds, inquiries, toggleSaved, inquire, clearSaved]);

  return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (!context) throw new Error("useProperties must be used inside PropertyProvider");
  return context;
}