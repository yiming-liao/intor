/**
 * Set the document language attribute.
 *
 * This function relies on `document.documentElement.lang`.
 */
export function setDocumentLocale(locale: string): void {
  if (typeof document === "undefined") return;

  document.documentElement.lang = locale;
}
