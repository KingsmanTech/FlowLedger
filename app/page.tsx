'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { BrandMark, DownloadIcon, EyeIcon, RefreshIcon, SendIcon, SpinnerIcon, XIcon } from '@/components/icons';
import { InvoiceForm } from '@/components/InvoiceForm';
import { ExportSheet, InvoicePreview } from '@/components/InvoicePreview';
import { exportInvoicePdf, sendInvoice } from '@/lib/exportPdf';
import { useInvoice } from '@/hooks/useInvoice';
import { prefersReducedMotion } from '@/lib/motion';
import type { InvoiceData } from '@/lib/types';
import { GhostButton, PrimaryButton } from '@/components/ui';

export default function Home() {
  const { invoice, update, updateItem, addItem, removeItem, reset } = useInvoice();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Always export the latest invoice, even if it changed mid-export.
  const invoiceRef = useRef(invoice);
  useEffect(() => {
    invoiceRef.current = invoice;
  }, [invoice]);

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const latest = invoiceRef.current;
      await exportInvoicePdf(latest, `Invoice-${latest.invoiceNumber}`);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Sorry — the PDF could not be generated. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const closePreview = useCallback(() => setPreviewOpen(false), []);
  const openPreview = useCallback(() => setPreviewOpen(true), []);

  const handleNew = () => {
    if (window.confirm('Start a new invoice? This clears the current document.')) {
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ————— Top bar ————— */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandMark className="h-9 w-9" />
            <div className="leading-tight">
              <h1 className="text-[15px] font-bold tracking-tight text-gray-900">FlowLedger</h1>
              <div className="text-[11px] text-gray-400">Invoice maker</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNew}
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:inline-flex"
              title="Start a new invoice"
            >
              <RefreshIcon className="h-4 w-4" />
              New
            </button>
            <GhostButton
              type="button"
              onClick={() => sendInvoice(invoice)}
              className="hidden px-3.5 py-2 md:inline-flex"
            >
              <SendIcon className="h-4 w-4" />
              Send
            </GhostButton>
            <PrimaryButton
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="hidden px-3.5 py-2 sm:inline-flex"
            >
              {exporting ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : <DownloadIcon className="h-4 w-4" />}
              {exporting ? 'Generating…' : 'Download PDF'}
            </PrimaryButton>
          </div>
        </div>
      </header>

      {/* ————— Split screen: form (40%) + preview (60%) ————— */}
      <main className="mx-auto max-w-[1600px] lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Form column */}
        <section className="scroll-slim px-4 py-6 pb-32 sm:px-6 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:pb-10">
          <InvoiceForm
            invoice={invoice}
            update={update}
            updateItem={updateItem}
            addItem={addItem}
            removeItem={removeItem}
          />
        </section>

        {/* Preview column (desktop only) */}
        <section
          className="scroll-slim hidden border-l border-gray-200/80 bg-gray-100/50 px-6 py-6 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:overflow-y-auto"
        >
          <div className="mx-auto max-w-[820px]">
            {/* Preview toolbar */}
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <span className="relative flex h-2 w-2" aria-hidden>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600" />
                  </span>
                  Live preview
                </div>
                <p className="mt-0.5 text-xs text-gray-500">
                  A4 sheet · updates as you type · {invoice.currency}
                </p>
              </div>
              <GhostButton type="button" onClick={handleExport} disabled={exporting} className="px-3.5 py-2">
                {exporting ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : <DownloadIcon className="h-4 w-4" />}
                {exporting ? 'Generating…' : 'PDF'}
              </GhostButton>
            </div>

            <InvoicePreview invoice={invoice} />
          </div>
        </section>
      </main>

      {/* ————— Sticky mobile action bar ————— */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 pt-3 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex gap-3">
          <GhostButton type="button" onClick={handleExport} disabled={exporting} className="flex-1">
            {exporting ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : <DownloadIcon className="h-4 w-4" />}
            {exporting ? 'Generating…' : 'Download PDF'}
          </GhostButton>
          <PrimaryButton type="button" onClick={openPreview} className="flex-1">
            <EyeIcon className="h-4 w-4" />
            Preview
          </PrimaryButton>
        </div>
      </div>

      {/* ————— Mobile preview overlay ————— */}
      {previewOpen ? (
        <PreviewOverlay
          invoice={invoice}
          exporting={exporting}
          onClose={closePreview}
          onExport={handleExport}
          onSend={() => sendInvoice(invoiceRef.current)}
        />
      ) : null}

      {/* ————— Off-screen canonical sheet for PDF export ————— */}
      <ExportSheet invoice={invoice} />
    </div>
  );
}

/** Full-screen bottom sheet showing the live preview on mobile. */
function PreviewOverlay({
  invoice,
  exporting,
  onClose,
  onExport,
  onSend,
}: {
  invoice: InvoiceData;
  exporting: boolean;
  onClose: () => void;
  onExport: () => void;
  onSend: () => void;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Slide-up entrance.
  useLayoutEffect(() => {
    const el = sheetRef.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(el, { y: 48, opacity: 0, duration: 0.4, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, []);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm lg:hidden"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Invoice preview"
    >
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-x-0 bottom-0 flex max-h-[94vh] flex-col rounded-t-3xl bg-gray-50 shadow-2xl"
      >
        {/* Grab handle + header */}
        <div className="px-5 pb-3 pt-3">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-300" aria-hidden />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <EyeIcon className="h-4 w-4 text-indigo-600" />
              Invoice preview
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable preview */}
        <div className="scroll-slim flex-1 overflow-y-auto px-4 pb-4 pt-2">
          <div className="mx-auto max-w-[560px]">
            <InvoicePreview invoice={invoice} />
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex gap-3 border-t border-gray-200 bg-white px-4 pt-3"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <GhostButton type="button" onClick={onSend} className="flex-1">
            <SendIcon className="h-4 w-4" />
            Send
          </GhostButton>
          <PrimaryButton type="button" onClick={onExport} disabled={exporting} className="flex-1">
            {exporting ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : <DownloadIcon className="h-4 w-4" />}
            {exporting ? 'Generating…' : 'Download PDF'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
