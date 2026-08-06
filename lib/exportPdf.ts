import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { formatMoney } from './currency';
import { calcTotals, formatDate, parseNum } from './invoice';
import type { InvoiceData } from './types';

/** id of the off-screen, unscaled sheet instance used for high-fidelity capture. */
export const EXPORT_NODE_ID = 'invoice-export-doc';

/** A4 portrait page size in millimetres. */
const A4_W_MM = 210;
const A4_H_MM = 297;

/** Strip characters that are unsafe in file names. */
export function sanitizeFileName(name: string): string {
  return name.replace(/[^\w\-. ]/g, '').replace(/\s+/g, '-');
}

/**
 * Rasterise the invoice sheet with html2canvas (2x scale for crispness) and
 * lay the image out across A4 pages with jsPDF. Multi-page invoices are
 * sliced automatically.
 */
export async function exportInvoicePdf(
  invoice: InvoiceData,
  fileName?: string,
): Promise<void> {
  const node = document.getElementById(EXPORT_NODE_ID);
  if (!node) throw new Error('Invoice preview is not ready yet.');

  // Ensure webfonts (Geist) are loaded so the rasterised sheet uses them.
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    await document.fonts.ready;
  }

  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    imageTimeout: 0,
  });

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  const imgHeight = (canvas.height * A4_W_MM) / canvas.width;
  // PNG keeps the invoice text razor-sharp (no JPEG artifacts).
  const imgData = canvas.toDataURL('image/png');

  let heightLeft = imgHeight;
  let position = 0;

  // First page
  pdf.addImage(imgData, 'JPEG', 0, position, A4_W_MM, imgHeight);
  heightLeft -= A4_H_MM;

  // Additional pages for long invoices
  while (heightLeft > 0.5) {
    position -= A4_H_MM;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, A4_W_MM, imgHeight);
    heightLeft -= A4_H_MM;
  }

  const safeName = sanitizeFileName(fileName || `Invoice-${invoice.invoiceNumber}`);
  pdf.save(`${safeName}.pdf`);
}

/**
 * "Send" the invoice by opening the user's mail client with a pre-filled
 * message. Fully client-side — no backend required.
 */
export function sendInvoice(invoice: InvoiceData): void {
  const totals = calcTotals(invoice);
  const subject = `Invoice ${invoice.invoiceNumber} from ${invoice.businessName || 'FlowLedger'}`;
  const items = invoice.items
    .filter((it) => it.description.trim() || parseNum(it.rate) > 0)
    .map(
      (it) =>
        `• ${it.description || 'Item'} — ${it.qty || 0} × ${formatMoney(parseNum(it.rate), invoice.currency)}`,
    );

  const lines = [
    `Hi ${invoice.clientName || 'there'},`,
    '',
    `Please find invoice ${invoice.invoiceNumber} attached below.`,
    '',
    `Amount due: ${formatMoney(totals.total, invoice.currency)}`,
    `Due date: ${formatDate(invoice.dueDate, invoice.currency)}`,
    '',
    ...(items.length ? ['Items:', ...items, ''] : []),
    'If you have any questions, feel free to reply to this email.',
    '',
    'Best regards,',
    invoice.businessName || 'FlowLedger',
    invoice.businessEmail || '',
  ].filter((l) => l !== undefined);

  // The recipient address must NOT be URI-encoded (some clients mishandle %40).
  const mailto = `mailto:${invoice.clientEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  window.location.href = mailto;
}
