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
 *
 * getLocaleFromQuery({ locale: ["zh-TW"] }, "locale")
 * // => "zh-TW"
 * ```
 */
export function getLocaleFromQuery(
  query: Record<string, string | string[] | undefined> | undefined,
  queryKey: string,
): string | undefined {
  if (!query) return;

  const raw = query[queryKey];
  if (!raw) return;

  const value = Array.isArray(raw) ? raw[0] : raw;

  return value;
}
