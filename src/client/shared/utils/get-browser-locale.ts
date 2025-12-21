/**
 * Gets the browser-preferred locale.
 *
 * - Browser-only.
 * - Returns null if not available.
 */
export function getBrowserLocale(): string | null {
  if (typeof navigator === "undefined") return null;

  return navigator.languages?.[0] || navigator.language || null;
}
