'use client';

import { CURRENCIES, CURRENCY_OPTIONS } from '@/lib/currency';
import type { CurrencyCode } from '@/lib/types';
import { cn, inputClass } from './ui';

/**
 * Currency selector — Nigerian Naira sits in its own featured group at the
 * top, with global currencies grouped below.
 */
export function CurrencySelect({
  value,
  onChange,
}: {
  value: CurrencyCode;
  onChange: (code: CurrencyCode) => void;
}) {
  const others = CURRENCY_OPTIONS.filter((c) => c.code !== 'NGN');
  const ngn = CURRENCIES.NGN;

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CurrencyCode)}
        aria-label="Invoice currency"
        className={cn(inputClass, 'cursor-pointer appearance-none pr-9 font-medium')}
      >
        <optgroup label={`${ngn.flag} Nigeria — default`}>
          <option value="NGN">
            {ngn.flag} NGN — {ngn.label}
          </option>
        </optgroup>
        <optgroup label="Global currencies">
          {others.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.code} — {c.label}
            </option>
          ))}
        </optgroup>
      </select>
      {/* Custom chevron (native select arrow is hidden) */}
      <svg
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}
