import { CURRENCIES } from './currency';
import type { CurrencyCode, InvoiceData, InvoiceTotals, LineItem } from './types';

/** A4 width at 96dpi (210mm). All sheet rendering is based on this constant. */
export const SHEET_WIDTH = 794;

/** Generate a unique id with a randomUUID fallback. */
export function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Safely parse an editable string/number field into a finite number. */
export function parseNum(value: string | number | null | undefined): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const n = parseFloat(String(value ?? ''));
  return Number.isFinite(n) ? n : 0;
}

/** ISO date (yyyy-mm-dd) `days` from today. */
function isoDaysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** A fresh, empty line item row. */
export function blankItem(): LineItem {
  return { id: uid(), description: '', qty: '', rate: '' };
}

/**
 * The deterministic blank invoice the app starts with. Every field is empty
 * so the form guides the user with placeholders — no prefilled content.
 * Being a module-level constant (no randomness), server prerender and the
 * first client render are identical, so there is no hydration mismatch.
 */
export const BLANK_INVOICE: InvoiceData = {
  logo: null,
  accentColor: '#4F46E5',
  businessName: '',
  businessAddress: '',
  businessEmail: '',
  businessPhone: '',
  clientName: '',
  clientAddress: '',
  clientEmail: '',
  invoiceNumber: '',
  issueDate: '',
  dueDate: '',
  currency: 'NGN',
  items: [{ id: 'starter', description: '', qty: '', rate: '' }],
  taxRate: '',
  discount: '',
  shipping: '',
  bankName: '',
  accountName: '',
  accountNumber: '',
  bankCode: '',
  notes: '',
};

/** A brand-new, empty invoice with one starter line item (for "New"). */
export function blankInvoice(): InvoiceData {
  return {
    ...BLANK_INVOICE,
    items: [{ ...BLANK_INVOICE.items[0], id: uid() }],
  };
}

/**
 * A rich starter invoice (default currency: NGN) so the live preview
 * is beautiful the moment the app loads.
 */
export const SAMPLE_INVOICE: InvoiceData = {
  logo: null,
  accentColor: '#4F46E5',
  businessName: 'FlowLedger Studio',
  businessAddress: '14b Admiralty Way, Lekki Phase 1\nLagos, Nigeria',
  businessEmail: 'hello@flowledger.ng',
  businessPhone: '+234 803 000 1234',
  clientName: 'Adebayo & Sons Ltd.',
  clientAddress: 'Plot 7, Ahmadu Bello Way\nVictoria Island, Lagos',
  clientEmail: 'billing@adebayosons.com',
  invoiceNumber: 'FL-2026-0142',
  issueDate: isoDaysFromNow(0),
  dueDate: isoDaysFromNow(14),
  currency: 'NGN',
  items: [
    { id: 'sample-1', description: 'Brand identity design — logo suite + brand guidelines', qty: '1', rate: '850000' },
    { id: 'sample-2', description: 'Website development — marketing site (5 pages)', qty: '1', rate: '1450000' },
    { id: 'sample-3', description: 'Monthly SEO & content maintenance', qty: '3', rate: '180000' },
  ],
  taxRate: '7.5',
  discount: '0',
  shipping: '0',
  bankName: 'Zenith Bank',
  accountName: 'FlowLedger Ltd',
  accountNumber: '1012345678',
  bankCode: '057',
  notes: 'Thank you for your business! Payment is due within 14 days of the issue date.',
};

/** Compute all financial totals for an invoice. */
export function calcTotals(invoice: InvoiceData): InvoiceTotals {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + parseNum(item.qty) * parseNum(item.rate),
    0,
  );
  const discount = parseNum(invoice.discount);
  const base = Math.max(0, subtotal - discount);
  const tax = (base * parseNum(invoice.taxRate)) / 100;
  const shipping = parseNum(invoice.shipping);
  const total = Math.max(0, base + tax + shipping);

  return { subtotal, discount, tax, shipping, total };
}

/** Format an ISO date using the locale of the invoice currency. */
export function formatDate(iso: string, currency: CurrencyCode): string {
  if (!iso) return '—';
  const locale = CURRENCIES[currency]?.locale ?? 'en-US';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}
