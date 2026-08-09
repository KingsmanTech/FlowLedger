'use client';

import { formatMoney } from '@/lib/currency';
import { calcTotals } from '@/lib/invoice';
import type { CurrencyCode, InvoiceData } from '@/lib/types';
import { CurrencySelect } from './CurrencySelect';
import { PlusIcon } from './icons';
import { LineItemRow } from './LineItemRow';
import { LogoUpload } from './LogoUpload';
import { Field, SectionCard, TextArea, TextInput, cn } from './ui';

/** Preset accent colours for the invoice sheet header + totals block. */
const ACCENT_SWATCHES = [
  '#4F46E5', // indigo
  '#7C3AED', // violet
  '#0E7490', // cyan-700
  '#059669', // emerald-600
  '#D97706', // amber-600
  '#E11D48', // rose-600
  '#334155', // slate-700
  '#0F172A', // slate-900
];

export function InvoiceForm({
  invoice,
  update,
  updateItem,
  addItem,
  removeItem,
}: {
  invoice: InvoiceData;
  update: (patch: Partial<InvoiceData>) => void;
  updateItem: (id: string, patch: Partial<InvoiceData['items'][number]>) => void;
  addItem: () => void;
  removeItem: (id: string) => void;
}) {
  const totals = calcTotals(invoice);
  const currency = invoice.currency;

  return (
    <div className="space-y-5">
      {/* ————— Branding ————— */}
      <SectionCard title="Branding" subtitle="Logo, accent colour and your business details">
        <div className="space-y-4">
          <LogoUpload
            logo={invoice.logo}
            onChange={(logo) => update({ logo })}
            onClear={() => update({ logo: null })}
          />

          {/* Accent colour picker */}
          <div>
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Accent colour
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {ACCENT_SWATCHES.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => update({ accentColor: color })}
                  aria-label={`Set accent colour ${color}`}
                  className={cn(
                    'h-7 w-7 rounded-full transition-all hover:scale-110',
                    invoice.accentColor.toLowerCase() === color.toLowerCase()
                      ? 'scale-110 ring-2 ring-indigo-400 ring-offset-2'
                      : 'ring-1 ring-black/5',
                  )}
                  style={{ background: color }}
                />
              ))}
              {/* Custom colour input */}
              <label
                className="relative flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-400 transition-all hover:scale-110"
                title="Custom colour"
              >
                <input
                  type="color"
                  value={invoice.accentColor}
                  onChange={(e) => update({ accentColor: e.target.value })}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  aria-label="Pick a custom accent colour"
                />
                +
              </label>
            </div>
          </div>

          <Field label="Business name">
            <TextInput
              value={invoice.businessName}
              onChange={(e) => update({ businessName: e.target.value })}
              placeholder="Acme Ltd."
            />
          </Field>
          <Field label="Business address">
            <TextArea
              rows={2}
              value={invoice.businessAddress}
              onChange={(e) => update({ businessAddress: e.target.value })}
              placeholder="Street, City, Country"
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Email">
              <TextInput
                type="email"
                value={invoice.businessEmail}
                onChange={(e) => update({ businessEmail: e.target.value })}
                placeholder="hello@acme.com"
              />
            </Field>
            <Field label="Phone">
              <TextInput
                value={invoice.businessPhone}
                onChange={(e) => update({ businessPhone: e.target.value })}
                placeholder="+1 555 000 1234"
              />
            </Field>
          </div>
        </div>
      </SectionCard>

      {/* ————— Bill to ————— */}
      <SectionCard title="Bill to" subtitle="Client details">
        <div className="space-y-4">
          <Field label="Client name">
            <TextInput
              value={invoice.clientName}
              onChange={(e) => update({ clientName: e.target.value })}
              placeholder="Client & Sons Ltd."
            />
          </Field>
          <Field label="Client address">
            <TextArea
              rows={2}
              value={invoice.clientAddress}
              onChange={(e) => update({ clientAddress: e.target.value })}
              placeholder="Street, City, Country"
            />
          </Field>
          <Field label="Client email">
            <TextInput
              type="email"
              value={invoice.clientEmail}
              onChange={(e) => update({ clientEmail: e.target.value })}
              placeholder="billing@client.com"
            />
          </Field>
        </div>
      </SectionCard>

      {/* ————— Invoice details ————— */}
      <SectionCard title="Invoice details" subtitle="Number, dates and currency">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Invoice no.">
            <TextInput
              value={invoice.invoiceNumber}
              onChange={(e) => update({ invoiceNumber: e.target.value })}
              placeholder="INV-001"
            />
          </Field>
          <Field label="Currency">
            <CurrencySelect value={currency} onChange={(c: CurrencyCode) => update({ currency: c })} />
          </Field>
          <Field label="Issue date">
            <TextInput
              type="date"
              value={invoice.issueDate}
              onChange={(e) => update({ issueDate: e.target.value })}
              // Dates are sample-relative; tolerate server/client day-boundary drift.
              suppressHydrationWarning
            />
          </Field>
          <Field label="Due date">
            <TextInput
              type="date"
              value={invoice.dueDate}
              onChange={(e) => update({ dueDate: e.target.value })}
              suppressHydrationWarning
            />
          </Field>
        </div>
      </SectionCard>

      {/* ————— Line items ————— */}
      <SectionCard
        title="Line items"
        subtitle="What are you billing for?"
        badge={`${invoice.items.length} item${invoice.items.length === 1 ? '' : 's'}`}
      >
        {/* Desktop column headers (mobile rows stack their own labels implicitly) */}
        <div className="mb-2 hidden grid-cols-12 gap-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 sm:grid">
          <span className="col-span-5">Description</span>
          <span className="col-span-2">Qty</span>
          <span className="col-span-3">Rate</span>
          <span className="col-span-1 text-right">Amount</span>
          <span className="col-span-1" />
        </div>

        <div aria-live="polite">
          {invoice.items.map((item, index) => (
            <LineItemRow
              key={item.id}
              item={item}
              index={index}
              currency={currency}
              onUpdate={(patch) => updateItem(item.id, patch)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-2.5 text-sm font-medium text-gray-500 transition-all hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-600 active:scale-[0.99]"
        >
          <PlusIcon className="h-4 w-4" />
          Add item
        </button>
      </SectionCard>

      {/* ————— Financials ————— */}
      <SectionCard title="Financials" subtitle="Tax, discount and extra fees">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Discount" hint="Flat amount">
            <TextInput
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={invoice.discount}
              onChange={(e) => update({ discount: e.target.value })}
              placeholder="0"
              className="text-right tabular-nums"
            />
          </Field>
          <Field label="Tax rate" hint="Percent">
            <TextInput
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={invoice.taxRate}
              onChange={(e) => update({ taxRate: e.target.value })}
              placeholder="7.5"
              className="text-right tabular-nums"
            />
          </Field>
          <Field label="Shipping" hint="Misc fees">
            <TextInput
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={invoice.shipping}
              onChange={(e) => update({ shipping: e.target.value })}
              placeholder="0"
              className="text-right tabular-nums"
            />
          </Field>
        </div>

        {/* Compact live totals for quick reference while editing */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50/70 p-4 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span className="tabular-nums font-medium text-gray-700">
              {formatMoney(totals.subtotal, currency)}
            </span>
          </div>
          {parseFloat(invoice.discount) > 0 && (
            <div className="mt-1.5 flex justify-between text-gray-500">
              <span>Discount</span>
              <span className="tabular-nums text-rose-500">
                − {formatMoney(totals.discount, currency)}
              </span>
            </div>
          )}
          {parseFloat(invoice.taxRate) > 0 && (
            <div className="mt-1.5 flex justify-between text-gray-500">
              <span>Tax ({invoice.taxRate || 0}%)</span>
              <span className="tabular-nums text-gray-700">{formatMoney(totals.tax, currency)}</span>
            </div>
          )}
          {parseFloat(invoice.shipping) > 0 && (
            <div className="mt-1.5 flex justify-between text-gray-500">
              <span>Shipping</span>
              <span className="tabular-nums text-gray-700">
                {formatMoney(totals.shipping, currency)}
              </span>
            </div>
          )}
          <div className="mt-2.5 flex justify-between border-t border-gray-200 pt-2.5 text-[15px] font-semibold text-gray-900">
            <span>Total due</span>
            <span className="tabular-nums" style={{ color: invoice.accentColor }}>
              {formatMoney(totals.total, currency)}
            </span>
          </div>
        </div>
      </SectionCard>

      {/* ————— Payment details ————— */}
      <SectionCard
        title="Payment details"
        subtitle="Bank account info shown on the invoice"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Bank name">
            <TextInput
              value={invoice.bankName}
              onChange={(e) => update({ bankName: e.target.value })}
              placeholder="Zenith Bank"
            />
          </Field>
          <Field label="Account name">
            <TextInput
              value={invoice.accountName}
              onChange={(e) => update({ accountName: e.target.value })}
              placeholder="FlowLedger Ltd"
            />
          </Field>
          <Field label="Account number">
            <TextInput
              inputMode="numeric"
              value={invoice.accountNumber}
              onChange={(e) => update({ accountNumber: e.target.value })}
              placeholder="0123456789"
              className="tabular-nums"
            />
          </Field>
          <Field label="Sort code / IBAN">
            <TextInput
              value={invoice.bankCode}
              onChange={(e) => update({ bankCode: e.target.value })}
              placeholder="Sort code or IBAN"
              className="tabular-nums"
            />
          </Field>
        </div>
      </SectionCard>

      {/* ————— Notes ————— */}
      <SectionCard title="Notes" subtitle="Payment terms, thanks">
        <TextArea
          rows={4}
          value={invoice.notes}
          onChange={(e) => update({ notes: e.target.value })}
          placeholder="Payment is due within 14 days…"
        />
      </SectionCard>
    </div>
  );
}
