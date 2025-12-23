/**
 * Detect the preferred locale from the browser.
 *
 * - Client-side only
 */
export function detectBrowserLocale(): string | undefined {
  if (typeof navigator === "undefined") return undefined;

  return navigator.languages?.[0] || navigator.language || undefined;
}
