/**
 * Small helpers used to keep GSAP animations accessible.
 * Respects the user's `prefers-reduced-motion` system setting.
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
