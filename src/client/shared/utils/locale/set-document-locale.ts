/**
 * Sets the document language attribute.
 *
 * - Client-side only
 */
export function setDocumentLocale(locale: string): void {
  if (typeof document === "undefined") return;

  document.documentElement.lang = locale;
}
