import { canonicalizeLocale } from "./canonicalize-locale";
import { parseLocale } from "./parse-locale";

/**
 * Matches a locale candidate against a list of supported locales.
 *
 * Resolution order:
 * 1. Exact canonical match
 * 2. Same language + same script
 * 3. Same language only (only if candidate has no script)
 *
 * Returns `undefined` if no match is found.
 *
 * Notes:
 * - Matching is deterministic and order-sensitive.
 * - Does not perform automatic fallback to default locale.
 * - Does not cross script boundaries.
 */
export function matchLocale(
  locale: string | undefined,
  supportedLocales: readonly string[] = [],
): string | undefined {
  if (!locale || supportedLocales.length === 0) return;

  const canonicalCandidate = canonicalizeLocale(locale);
  if (!canonicalCandidate) return;

  const candidateParts = parseLocale(canonicalCandidate);

  const supportedCanonical = supportedLocales.flatMap((original) => {
    const canonical = canonicalizeLocale(original);
    if (!canonical) return [];
    return [{ original, canonical, parts: parseLocale(canonical) }];
  });

  // 1. Exact match
  for (const s of supportedCanonical) {
    if (s.canonical === canonicalCandidate) {
      return s.original;
    }
  }

  // 2. Same language + same script
  if (candidateParts.script) {
    for (const s of supportedCanonical) {
      if (
        s.parts.language === candidateParts.language &&
        s.parts.script === candidateParts.script
      ) {
        return s.original;
      }
    }
    return;
  }

  // 3. Same language only
  for (const s of supportedCanonical) {
    if (s.parts.language === candidateParts.language) {
      return s.original;
    }
  }

  return;
}
