import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export const PlusIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const TrashIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" />
  </svg>
);

export const DownloadIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
  </svg>
);

export const EyeIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const XIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const SendIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

export const RefreshIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" />
  </svg>
);

export const SpinnerIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M21 12a9 9 0 1 1-6.22-8.56" />
  </svg>
);

/** Brand mark: indigo rounded square with document bars (matches app/icon.svg). */
export const BrandMark = ({ className }: { className?: string }) => (
  <span
    className={`flex items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm ${className ?? ''}`}
  >
    <svg viewBox="0 0 64 64" className="h-1/2 w-1/2" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round">
      <path d="M18 22h28M18 32h28M18 42h16" />
    </svg>
  </span>
);
