export type LocaleParts = {
  language: string;
  script?: string;
  region?: string;
};

/**
 * Parses a canonical locale tag into structural components.
 *
 * - Uses `Intl.Locale` when available.
 * - Falls back to minimal parsing (language only) if unavailable.
 *
 * This function does not validate or match locales.
 */
export function parseLocale(tag: string): LocaleParts {
  try {
    if (typeof Intl !== "undefined" && typeof Intl.Locale === "function") {
      const locale = new Intl.Locale(tag);
      return {
        language: locale.language,
        script: locale.script,
        region: locale.region,
      };
    }
  } catch {
    // fallback below
  }

  const parts = tag.split("-");
  return { language: parts[0].toLowerCase() };
}
