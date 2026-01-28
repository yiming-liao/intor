import type { Locale } from "intor-translator";

/**
 * Set the document language attribute.
 *
 * This function relies on `document.documentElement.lang`.
 */
export function setDocumentLocale(locale: Locale): void {
  if (typeof document === "undefined") return;

  document.documentElement.lang = locale;
}
