'use client';

import { useRef } from 'react';
import { cn } from './ui';

const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * Logo uploader — reads the selected image into a data-URL so it renders
 * instantly in the live preview and survives PDF export (no CORS issues).
 */
export function LogoUpload({
  logo,
  onChange,
  onClear,
}: {
  logo: string | null;
  onChange: (dataUrl: string) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (PNG, JPG, SVG, WebP).');
      return;
    }
    if (file.size > MAX_LOGO_SIZE) {
      alert('Logo must be smaller than 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors',
          logo
            ? 'border-gray-200 bg-white'
            : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50/40',
        )}
        aria-label={logo ? 'Change logo' : 'Upload a logo'}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="Business logo" className="h-full w-full object-contain p-1.5" />
        ) : (
          <span className="px-2 text-center text-[11px] font-medium leading-tight text-gray-400">
            Add logo
          </span>
        )}
      </button>

      <div className="flex flex-col items-start gap-1.5">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
        >
          {logo ? 'Change logo' : 'Upload logo'}
        </button>
        {logo ? (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-gray-400 transition-colors hover:text-rose-500"
          >
            Remove
          </button>
        ) : (
          <span className="text-[11px] text-gray-400">PNG, JPG or SVG · 2MB max</span>
        )}
      </div>
    </div>
  );
}
