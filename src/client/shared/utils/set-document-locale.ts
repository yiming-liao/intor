/**
 * Sets the document language attribute.
 *
 * - Browser-only.
 * - No-op in non-DOM environments.
 */
export function setDocumentLocale(locale: string): void {
  if (typeof document === "undefined") return;

  document.documentElement.lang = locale;
}
