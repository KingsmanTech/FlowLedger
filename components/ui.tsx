import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';

/** Join class names, dropping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** Shared input styling — clean, light borders, soft shadow, indigo focus ring. */
export const inputClass =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60';

/**
 * Labelled form field wrapper. The label element wraps the control, so
 * clicking the label focuses the input (works without explicit ids).
 */
export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block">
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </span>
        {children}
      </label>
      {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}

/** White card container used for every form section. */
export function SectionCard({
  title,
  subtitle,
  badge,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn('rounded-xl border border-gray-200 bg-white p-5 shadow-soft', className)}
    >
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" aria-hidden />
            {title}
          </h2>
          {subtitle ? <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p> : null}
        </div>
        {badge ? (
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-500">
            {badge}
          </span>
        ) : null}
      </header>
      {children}
    </section>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputClass, className)} />;
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputClass, 'leading-relaxed', className)} />;
}

/** Primary action button — Electric Indigo. */
export function PrimaryButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100',
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Secondary action button — white with a light border. */
export function GhostButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
    >
      {children}
    </button>
  );
}
