/**
 * Shared domain types for FlowLedger.
 */

/** Currency codes supported by the app. NGN is featured prominently. */
export type CurrencyCode =
  | 'NGN'
  | 'USD'
  | 'GBP'
  | 'EUR'
  | 'GHS'
  | 'KES'
  | 'ZAR'
  | 'CAD'
  | 'AUD'
  | 'JPY'
  | 'CNY'
  | 'INR'
  | 'AED'
  | 'SAR'
  | 'CHF'
  | 'SEK';

/** A single line item on the invoice. qty/rate are kept as strings while editing. */
export interface LineItem {
  id: string;
  description: string;
  qty: string;
  rate: string;
}

/** The complete invoice document state, persisted to localStorage. */
export interface InvoiceData {
  // Branding / business details
  logo: string | null; // data-URL of the uploaded logo
  accentColor: string; // hex color used on the rendered sheet
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  businessPhone: string;

  // Client (bill-to) details
  clientName: string;
  clientAddress: string;
  clientEmail: string;

  // Invoice meta
  invoiceNumber: string;
  issueDate: string; // ISO yyyy-mm-dd
  dueDate: string; // ISO yyyy-mm-dd
  currency: CurrencyCode;

  // Financials (kept as strings while editing)
  items: LineItem[];
  taxRate: string; // percentage, e.g. "7.5"
  discount: string; // flat amount in the invoice currency
  shipping: string; // flat miscellaneous fee

  // Payment / bank details shown on the sheet
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankCode: string; // sort code / routing number / IBAN / SWIFT

  // Extras
  notes: string;
}

/** Computed financial snapshot of an invoice. */
export interface InvoiceTotals {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}
