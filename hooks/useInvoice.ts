import { useCallback, useEffect, useState } from 'react';
import { blankInvoice, blankItem, SAMPLE_INVOICE } from '@/lib/invoice';
import type { InvoiceData, LineItem } from '@/lib/types';

const STORAGE_KEY = 'flowledger.invoice.v1';

/**
 * Read a previously saved invoice from localStorage, if any.
 * Called only after mount so the first (hydration) render always matches
 * the server-rendered sample and no hydration mismatch occurs.
 */
function loadStoredInvoice(): InvoiceData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<InvoiceData>;
      return { ...SAMPLE_INVOICE, ...parsed };
    }
  } catch {
    // Corrupt storage — ignore.
  }
  return null;
}

export interface InvoiceStore {
  invoice: InvoiceData;
  /** Patch top-level invoice fields. */
  update: (patch: Partial<InvoiceData>) => void;
  /** Patch a single line item by id. */
  updateItem: (id: string, patch: Partial<LineItem>) => void;
  /** Append a new blank line item. */
  addItem: () => void;
  /** Remove a line item by id. */
  removeItem: (id: string) => void;
  /** Clear everything and start a fresh invoice. */
  reset: () => void;
}

/** Central state hook: the single source of truth for the invoice document. */
export function useInvoice(): InvoiceStore {
  // Always start from the sample so server prerender and first client render match.
  const [invoice, setInvoice] = useState<InvoiceData>(SAMPLE_INVOICE);
  const [hydrated, setHydrated] = useState(false);

  // Restore a saved invoice after mount (no hydration mismatch).
  useEffect(() => {
    const stored = loadStoredInvoice();
    if (stored) setInvoice(stored);
    setHydrated(true);
  }, []);

  // Persist every change to localStorage (safe, small payload).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invoice));
    } catch {
      // Storage may be unavailable (private mode, quota) — ignore.
    }
  }, [invoice, hydrated]);

  const update = useCallback((patch: Partial<InvoiceData>) => {
    setInvoice((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateItem = useCallback((id: string, patch: Partial<LineItem>) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }, []);

  const addItem = useCallback(() => {
    setInvoice((prev) => ({ ...prev, items: [...prev.items, blankItem()] }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }, []);

  const reset = useCallback(() => {
    setInvoice(blankInvoice());
  }, []);

  return { invoice, update, updateItem, addItem, removeItem, reset };
}
