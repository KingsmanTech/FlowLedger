# FlowLedger — Invoice Maker

A premium, minimalist invoice maker built with **Next.js (App Router)**, **Tailwind CSS**,
**GSAP** and **Geist** typography. Generate beautiful, A4-ready PDF invoices with a
real-time split-screen preview, global currency support (Nigerian Naira featured), and
custom branding — all in the browser, zero-config on Vercel.

![Stack](https://img.shields.io/badge/Next.js-14-black) ![Stack](https://img.shields.io/badge/Tailwind-3-38bdf8) ![Stack](https://img.shields.io/badge/GSAP-3-88ce02)

---

## ✨ Features

- **Split-screen studio** — 40% input form / 60% live A4 preview on desktop; a sticky
  bottom bar + slide-up preview overlay on mobile.
- **Global currencies** — NGN featured front-and-centre alongside USD, GBP, EUR, GHS,
  KES, ZAR, CAD, AUD, JPY, CNY, INR, AED, SAR, CHF and SEK. All calculations and
  previews reformat instantly via `Intl.NumberFormat` per locale.
- **Dynamic billing table** — add, edit and remove line items with GSAP slide/fade-in on
  add and collapse-out on delete. Subtotal, discount, tax rate, shipping/misc fees and
  total due are computed live.
- **Custom branding** — logo upload (data-URL), business & client details, unique invoice
  numbers, and a selectable accent colour for the rendered sheet.
- **Payment details** — structured bank/account fields (bank, account name, account number,
  sort code/IBAN) rendered on the sheet and included in the email summary.
- **Placeholder-guided start** — every field opens empty with a hint placeholder, so you
  type your own content; a one-click **Example** button loads a sample invoice to demo.
- **One-click PDF export** — `html2canvas` + `jsPDF` produce crisp A4 PDFs (multi-page
  supported) from a canonical off-screen sheet instance.
- **Send by email** — a mailto shortcut composes a ready-to-send invoice summary.
- **Auto-save** — the entire invoice persists to `localStorage`.
- **Accessible animations** — all GSAP motion respects `prefers-reduced-motion`.

---

## 📁 Folder structure

```
flowledger/
├── app/
│   ├── globals.css              # Tailwind entry, base styles, slim scrollbars
│   ├── icon.svg                 # Favicon (indigo document mark)
│   ├── layout.tsx               # Root layout — Geist font, metadata
│   └── page.tsx                 # Main page — split layout, header, mobile overlay
├── components/
│   ├── CurrencySelect.tsx       # Styled currency selector (NGN featured group)
│   ├── InvoiceForm.tsx          # Full input form: branding, client, meta, financials, payment
│   ├── InvoicePreview.tsx       # A4 sheet, auto-fit frame, off-screen export sheet
│   ├── LineItemRow.tsx          # Editable item row with GSAP add/remove animations
│   ├── LogoUpload.tsx           # Logo upload → data-URL
│   ├── icons.tsx                # Inline SVG icon set
│   └── ui.tsx                   # Field, SectionCard, buttons, input primitives
├── hooks/
│   └── useInvoice.ts            # Invoice state + localStorage persistence
├── lib/
│   ├── currency.ts              # Currency registry + Intl money formatter
│   ├── exportPdf.ts             # jsPDF/html2canvas export + mailto "Send"
│   ├── invoice.ts               # Defaults, calculations, id/date helpers
│   ├── motion.ts                # prefers-reduced-motion helper
│   └── types.ts                 # Shared domain types
├── .eslintrc.json
├── .gitignore
├── next-env.d.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev
# → http://localhost:3000
```

Other scripts:

```bash
npm run build   # production build (type-checks + lints)
npm run start   # serve the production build
npm run lint    # ESLint
```

---

## ▲ Deploying to Vercel (zero-config)

1. Push this folder to a Git repository (GitHub / GitLab / Bitbucket).
2. In Vercel, click **Add New → Project** and import the repository.
3. Vercel auto-detects **Next.js** — framework preset, build command (`next build`)
   and output directory (`.next`) are filled in for you.
4. Click **Deploy**. That is it — no environment variables or config files needed.

All PDF generation, currency formatting and invoice state live entirely in the browser,
so the app is fully static-rendered and needs no serverless functions.

---

## 🛠 Tech stack

| Purpose        | Library                                  |
| -------------- | ---------------------------------------- |
| Framework      | Next.js 14 (App Router, React 18)        |
| Styling        | Tailwind CSS 3                           |
| Typography     | Geist (via `geist/font/sans`)            |
| Animation      | GSAP 3                                   |
| PDF export     | jsPDF + html2canvas                      |

---

## 📝 Notes

- The invoice auto-saves locally; clear it with **New** in the top bar.
- Fields start empty and show placeholder hints — fill them with your own content, or press
  **Example** in the top bar to load a pre-filled sample invoice.
- The default currency is **NGN** (₦) — switch anytime from the *Invoice details* section.
- The preview renders a fixed-width A4 sheet (794px @ 96dpi) that scales down to fit
  narrow screens; PDF export always captures it at full resolution (2× raster scale).
