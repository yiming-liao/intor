/**
 * Detect the preferred locale from the browser.
 *
 * This function relies on `navigator.languages` and `navigator.language`.
 */
export function detectBrowserLocale(): string | undefined {
  if (typeof navigator === "undefined") return undefined;

  return navigator.languages?.[0] || navigator.language || undefined;
}
