'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { formatMoney } from '@/lib/currency';
import { EXPORT_NODE_ID } from '@/lib/exportPdf';
import { SHEET_WIDTH, calcTotals, formatDate, parseNum } from '@/lib/invoice';
import { prefersReducedMotion } from '@/lib/motion';
import type { InvoiceData } from '@/lib/types';
import { cn } from './ui';

/**
 * The rendered A4 invoice document. Pure presentational — receives the
 * invoice object and renders every field with live calculations.
 */
export function InvoiceSheet({ invoice }: { invoice: InvoiceData }) {
  const totals = useMemo(() => calcTotals(invoice), [invoice]);
  const currency = invoice.currency;
  const accent = invoice.accentColor || '#4F46E5';
  const { subtotal, discount, tax, shipping, total } = totals;
  const taxRate = parseNum(invoice.taxRate);

  return (
    <div
      className="bg-white text-gray-800"
      style={{ width: SHEET_WIDTH, borderTop: `6px solid ${accent}` }}
    >
      {/* ————— Header: brand + logo (left), INVOICE title (right) ————— */}
      <div className="flex items-start justify-between gap-10 px-14 pt-12">
        <div className="max-w-[340px]">
          {invoice.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={invoice.logo}
              alt="Business logo"
              className="mb-4 h-16 w-auto max-h-16 object-contain"
            />
          ) : null}
          {invoice.businessName ? (
            <div
              className={cn(
                'font-bold leading-tight tracking-tight text-gray-900',
                invoice.logo ? 'text-lg' : 'text-[26px]',
              )}
            >
              {invoice.businessName}
            </div>
          ) : null}
          <div className="mt-2.5 space-y-0.5 text-[13px] leading-relaxed text-gray-500">
            {invoice.businessAddress ? (
              <p className="whitespace-pre-line">{invoice.businessAddress}</p>
            ) : null}
            {invoice.businessEmail ? <p>{invoice.businessEmail}</p> : null}
            {invoice.businessPhone ? <p>{invoice.businessPhone}</p> : null}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div
            className="text-[34px] font-extrabold uppercase leading-none tracking-[0.08em]"
            style={{ color: accent }}
          >
            Invoice
          </div>
          <div className="mt-2 text-sm font-semibold text-gray-900">
            #{invoice.invoiceNumber || '—'}
          </div>
          <div className="mt-4 space-y-1 text-[13px] text-gray-500">
            <div className="flex justify-end gap-3">
              <span className="text-gray-400">Issued</span>
              <span className="font-medium tabular-nums text-gray-700">
                {formatDate(invoice.issueDate, currency)}
              </span>
            </div>
            <div className="flex justify-end gap-3">
              <span className="text-gray-400">Due</span>
              <span className="font-medium tabular-nums text-gray-700">
                {formatDate(invoice.dueDate, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ————— Bill to ————— */}
      <div className="mt-10 px-14">
        <div className="max-w-[280px]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
            Billed to
          </div>
          <div className="mt-2 text-[15px] font-semibold text-gray-900">
            {invoice.clientName || 'Client name'}
          </div>
          {invoice.clientAddress ? (
            <div className="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-gray-500">
              {invoice.clientAddress}
            </div>
          ) : null}
          {invoice.clientEmail ? (
            <div className="mt-1 text-[13px] text-gray-500">{invoice.clientEmail}</div>
          ) : null}
        </div>
      </div>

      {/* ————— Line items table ————— */}
      <div className="mt-10 px-14">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b-2 text-[11px] uppercase tracking-[0.12em] text-gray-400" style={{ borderColor: accent }}>
              <th className="pb-3 text-left font-semibold">Description</th>
              <th className="pb-3 text-right font-semibold">Qty</th>
              <th className="pb-3 text-right font-semibold">Rate</th>
              <th className="pb-3 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-400">
                  No line items yet — add one from the form.
                </td>
              </tr>
            ) : (
              invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3.5 pr-4 text-gray-800">
                    {item.description || 'Untitled item'}
                  </td>
                  <td className="py-3.5 text-right tabular-nums text-gray-600">{item.qty || 0}</td>
                  <td className="py-3.5 text-right tabular-nums text-gray-600">
                    {formatMoney(parseNum(item.rate), currency)}
                  </td>
                  <td className="py-3.5 text-right font-semibold tabular-nums text-gray-900">
                    {formatMoney(parseNum(item.qty) * parseNum(item.rate), currency)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ————— Totals ————— */}
      <div className="mt-8 flex justify-end px-14">
        <div className="w-[300px] space-y-2 text-[13px]">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium tabular-nums text-gray-800">
              {formatMoney(subtotal, currency)}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Discount</span>
              <span className="tabular-nums text-rose-500">− {formatMoney(discount, currency)}</span>
            </div>
          )}
          {taxRate > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Tax ({invoice.taxRate || 0}%)</span>
              <span className="tabular-nums text-gray-800">{formatMoney(tax, currency)}</span>
            </div>
          )}
          {shipping > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping &amp; misc</span>
              <span className="tabular-nums text-gray-800">{formatMoney(shipping, currency)}</span>
            </div>
          )}

          <div
            className="mt-3 flex items-center justify-between rounded-xl px-4 py-3 text-white"
            style={{ background: accent }}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] opacity-90">
              Total due
            </span>
            <span className="text-lg font-bold tabular-nums">{formatMoney(total, currency)}</span>
          </div>
          {invoice.dueDate ? (
            <div className="pt-0.5 text-right text-xs text-gray-400">
              Payment due by {formatDate(invoice.dueDate, currency)}
            </div>
          ) : null}
        </div>
      </div>

      {/* ————— Notes ————— */}
      {invoice.notes ? (
        <div className="mt-10 px-14">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
            Notes
          </div>
          <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-gray-600">
            {invoice.notes}
          </p>
        </div>
      ) : null}

      {/* ————— Footer ————— */}
      <footer className="mt-14 flex items-center justify-between border-t border-gray-100 px-14 pb-10 pt-5 text-[11px] text-gray-500">
        <span>{invoice.businessEmail || invoice.businessName || 'FlowLedger'}</span>
        <span>
          Generated with <span className="font-semibold" style={{ color: accent }}>FlowLedger</span>
        </span>
      </footer>
    </div>
  );
}

/**
 * Scales the A4 sheet to fit its container width (downscaling only, never up),
 * so the preview always fits without horizontal scrolling.
 */
function AutoFitFrame({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  // `ready` stays false until the first measure, so we never render a scale(0) flash.
  const [ready, setReady] = useState(false);
  const [scale, setScale] = useState(1);
  const [innerHeight, setInnerHeight] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const measure = () => {
      setScale(Math.min(1, container.clientWidth / SHEET_WIDTH));
      setInnerHeight(inner.offsetHeight);
      setReady(true);
    };

    const ro1 = new ResizeObserver(measure);
    const ro2 = new ResizeObserver(measure);
    ro1.observe(container);
    ro2.observe(inner);

    measure();
    return () => {
      ro1.disconnect();
      ro2.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {/* Wrapper gets the scaled height so the scroll area matches the visuals. */}
      <div style={{ height: Math.round(innerHeight * scale), overflow: 'hidden' }}>
        <div
          ref={innerRef}
          style={{
            width: SHEET_WIDTH,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            visibility: ready ? 'visible' : 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Framed, auto-fitted preview with a subtle GSAP entrance.
 * Used in the desktop column and the mobile overlay.
 */
export function InvoicePreview({ invoice, className }: { invoice: InvoiceData; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(el, { y: 24, opacity: 0, duration: 0.55, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn('overflow-hidden rounded-lg bg-white shadow-sheet ring-1 ring-gray-200/70', className)}
    >
      <AutoFitFrame>
        <InvoiceSheet invoice={invoice} />
      </AutoFitFrame>
    </div>
  );
}

/**
 * Canonical, off-screen, unscaled instance used for pixel-perfect PDF capture.
 * html2canvas targets this node by id (see lib/exportPdf.ts).
 */
export function ExportSheet({ invoice }: { invoice: InvoiceData }) {
  return (
    <div
      id={EXPORT_NODE_ID}
      aria-hidden
      className="pointer-events-none fixed -left-[99999px] top-0"
      style={{ width: SHEET_WIDTH }}
    >
      <InvoiceSheet invoice={invoice} />
    </div>
  );
}
