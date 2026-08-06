import type { CurrencyCode } from './types';

/** Metadata for a supported currency. */
export interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  label: string;
  region: string;
  flag: string;
  /** BCP-47 locale used by Intl.NumberFormat for grouping/decimals. */
  locale: string;
  /** Number of fraction digits to render (JPY uses 0). */
  decimals: number;
}

/**
 * Master currency registry. The Nigerian Naira is first-class:
 * it is the default currency and appears at the top of the selector.
 */
export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  NGN: { code: 'NGN', symbol: '₦', label: 'Nigerian Naira', region: 'Nigeria', flag: '🇳🇬', locale: 'en-NG', decimals: 2 },
  USD: { code: 'USD', symbol: '$', label: 'US Dollar', region: 'United States', flag: '🇺🇸', locale: 'en-US', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', label: 'British Pound', region: 'United Kingdom', flag: '🇬🇧', locale: 'en-GB', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', label: 'Euro', region: 'European Union', flag: '🇪🇺', locale: 'en-IE', decimals: 2 },
  GHS: { code: 'GHS', symbol: '₵', label: 'Ghanaian Cedi', region: 'Ghana', flag: '🇬🇭', locale: 'en-GH', decimals: 2 },
  KES: { code: 'KES', symbol: 'KSh', label: 'Kenyan Shilling', region: 'Kenya', flag: '🇰🇪', locale: 'en-KE', decimals: 2 },
  ZAR: { code: 'ZAR', symbol: 'R', label: 'South African Rand', region: 'South Africa', flag: '🇿🇦', locale: 'en-ZA', decimals: 2 },
  CAD: { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar', region: 'Canada', flag: '🇨🇦', locale: 'en-CA', decimals: 2 },
  AUD: { code: 'AUD', symbol: 'A$', label: 'Australian Dollar', region: 'Australia', flag: '🇦🇺', locale: 'en-AU', decimals: 2 },
  JPY: { code: 'JPY', symbol: '¥', label: 'Japanese Yen', region: 'Japan', flag: '🇯🇵', locale: 'ja-JP', decimals: 0 },
  CNY: { code: 'CNY', symbol: '¥', label: 'Chinese Yuan', region: 'China', flag: '🇨🇳', locale: 'zh-CN', decimals: 2 },
  INR: { code: 'INR', symbol: '₹', label: 'Indian Rupee', region: 'India', flag: '🇮🇳', locale: 'en-IN', decimals: 2 },
  AED: { code: 'AED', symbol: 'AED', label: 'UAE Dirham', region: 'United Arab Emirates', flag: '🇦🇪', locale: 'ar-AE', decimals: 2 },
  SAR: { code: 'SAR', symbol: 'SAR', label: 'Saudi Riyal', region: 'Saudi Arabia', flag: '🇸🇦', locale: 'ar-SA', decimals: 2 },
  CHF: { code: 'CHF', symbol: 'CHF', label: 'Swiss Franc', region: 'Switzerland', flag: '🇨🇭', locale: 'de-CH', decimals: 2 },
  SEK: { code: 'SEK', symbol: 'kr', label: 'Swedish Krona', region: 'Sweden', flag: '🇸🇪', locale: 'sv-SE', decimals: 2 },
};

/** Selector options: NGN first, then the rest alphabetically by code. */
export const CURRENCY_OPTIONS: CurrencyMeta[] = [
  CURRENCIES.NGN,
  ...[
    CURRENCIES.AED,
    CURRENCIES.AUD,
    CURRENCIES.CAD,
    CURRENCIES.CHF,
    CURRENCIES.CNY,
    CURRENCIES.EUR,
    CURRENCIES.GBP,
    CURRENCIES.GHS,
    CURRENCIES.INR,
    CURRENCIES.JPY,
    CURRENCIES.KES,
    CURRENCIES.SAR,
    CURRENCIES.SEK,
    CURRENCIES.USD,
    CURRENCIES.ZAR,
  ],
];

/**
 * Format an amount in the given currency using Intl.NumberFormat so that
 * grouping and symbols are correct per locale (e.g. ₦1,200,000.00).
 */
export function formatMoney(amount: number, currency: CurrencyCode): string {
  const meta = CURRENCIES[currency];
  try {
    return new Intl.NumberFormat(meta.locale, {
      style: 'currency',
      currency: meta.code,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: meta.decimals,
      maximumFractionDigits: meta.decimals,
    }).format(amount);
  } catch {
    // Defensive fallback if a locale is unavailable in the runtime.
    return `${meta.symbol}${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
}
