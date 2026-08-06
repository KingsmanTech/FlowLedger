'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { formatMoney } from '@/lib/currency';
import { parseNum } from '@/lib/invoice';
import { prefersReducedMotion } from '@/lib/motion';
import type { CurrencyCode, LineItem } from '@/lib/types';
import { TrashIcon } from './icons';
import { TextInput, cn } from './ui';

/**
 * A single editable line item.
 *
 * Animations (GSAP):
 *  - on mount: slides down + fades in (staggered slightly by row index)
 *  - on delete: fades out, collapses its height, then commits removal
 */
export function LineItemRow({
  item,
  index,
  currency,
  onUpdate,
  onRemove,
}: {
  item: LineItem;
  index: number;
  currency: CurrencyCode;
  onUpdate: (patch: Partial<LineItem>) => void;
  onRemove: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  // Entrance animation (runs once, when the row is added to the list).
  useLayoutEffect(() => {
    const el = rowRef.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0,
        y: -14,
        duration: 0.4,
        ease: 'power3.out',
        delay: Math.min(index * 0.03, 0.15),
      });
    });
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animate the collapse, then let the parent actually delete the row.
  const handleRemove = () => {
    const el = rowRef.current;
    if (!el || prefersReducedMotion()) {
      onRemove();
      return;
    }
    gsap.to(el, {
      opacity: 0,
      y: -6,
      height: 0,
      marginBottom: 0,
      duration: 0.28,
      ease: 'power2.inOut',
      onComplete: onRemove,
    });
  };

  const amount = parseNum(item.qty) * parseNum(item.rate);

  return (
    <div
      ref={rowRef}
      className="mb-3 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow focus-within:border-indigo-400 focus-within:shadow-md"
    >
      <div className="grid grid-cols-12 items-center gap-2 px-3 py-2.5 sm:gap-3">
        {/* Description — full width on mobile, first column on desktop */}
        <div className="col-span-12 sm:col-span-5">
          <TextInput
            value={item.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Item description (e.g. Logo design)"
            aria-label={`Item ${index + 1} description`}
            className="border-transparent bg-transparent px-1 shadow-none focus:border-transparent focus:ring-0 sm:border-gray-200 sm:bg-white sm:shadow-sm sm:focus:border-indigo-500 sm:focus:ring-2 sm:focus:ring-indigo-100"
          />
        </div>

        {/* Qty */}
        <div className="col-span-3 sm:col-span-2">
          <TextInput
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={item.qty}
            onChange={(e) => onUpdate({ qty: e.target.value })}
            placeholder="0"
            aria-label={`Item ${index + 1} quantity`}
            className="text-right tabular-nums sm:text-left"
          />
        </div>

        {/* Rate */}
        <div className="col-span-4 sm:col-span-3">
          <TextInput
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={item.rate}
            onChange={(e) => onUpdate({ rate: e.target.value })}
            placeholder="0.00"
            aria-label={`Item ${index + 1} rate`}
            className="text-right tabular-nums"
          />
        </div>

        {/* Computed amount — hidden on the smallest screens */}
        <div
          className={cn(
            'col-span-3 text-right text-sm font-semibold tabular-nums text-gray-700 sm:col-span-1 sm:px-2',
          )}
          aria-live="polite"
        >
          {formatMoney(amount, currency)}
        </div>

        {/* Delete */}
        <div className="col-span-2 flex justify-end sm:col-span-1">
          <button
            type="button"
            onClick={handleRemove}
            aria-label={`Remove item ${index + 1}`}
            className="rounded-md p-2 text-gray-300 transition-colors hover:bg-rose-50 hover:text-rose-500 active:scale-90"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
