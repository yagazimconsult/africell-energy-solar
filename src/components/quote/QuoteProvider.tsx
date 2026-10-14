"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface QuoteItem {
  key: string; // `${category}/${product}`
  name: string;
  model?: string;
  href: string;
  image: string;
  qty: number;
}

/** Result of the sizing calculator, carried into the quote request. */
export interface SizingSummary {
  appliances: string[];
  loadKw: string;
  dailyKwh: string;
  batteryShare: number;
}

interface QuoteContextValue {
  items: QuoteItem[];
  count: number;
  sizing: SizingSummary | null;
  add: (item: Omit<QuoteItem, "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  has: (key: string) => boolean;
  setSizing: (s: SizingSummary | null) => void;
}

const QuoteContext = createContext<QuoteContextValue | null>(null);
const STORAGE_KEY = "africell-quote-v1";
const SIZING_KEY = "africell-quote-sizing-v1";

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [sizing, setSizing] = useState<SizingSummary | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      const rawSizing = localStorage.getItem(SIZING_KEY);
      if (rawSizing) setSizing(JSON.parse(rawSizing));
    } catch {
      // Storage can be unavailable (private mode); the basket simply starts empty.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      if (sizing) localStorage.setItem(SIZING_KEY, JSON.stringify(sizing));
      else localStorage.removeItem(SIZING_KEY);
    } catch {}
  }, [items, sizing, loaded]);

  const add = useCallback((item: Omit<QuoteItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.key === item.key);
      if (existing) return prev.map((i) => (i.key === item.key ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { ...item, qty }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(999, qty)) } : i)));
  }, []);

  const remove = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => {
    setItems([]);
    setSizing(null);
  }, []);

  const value = useMemo<QuoteContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      sizing,
      add,
      setQty,
      remove,
      clear,
      has: (key) => items.some((i) => i.key === key),
      setSizing,
    }),
    [items, sizing, add, setQty, remove, clear],
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used inside QuoteProvider");
  return ctx;
}
