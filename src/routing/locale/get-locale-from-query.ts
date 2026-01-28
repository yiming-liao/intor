import type { NormalizedQuery } from "@/core";

/**
 * Get locale candidate from URL query parameters.
 *
 * Extracts the value of the configured query key, without
 * validation or normalization.
 *
 * @example
 * ```ts
 * getLocaleFromQuery({ locale: "en" }, "locale")
 * // => "en"
 *
 * getLocaleFromQuery({}, "locale")
 * // => undefined
 */
export function getLocaleFromQuery(
  query: NormalizedQuery | undefined,
  queryKey: string,
): string | undefined {
  if (!query) return;

  return query[queryKey];
}
