import type { IntorResolvedConfig } from "@/config";
import { normalizeLocale } from "@/core";

/**
 * Extracts locale from URL query parameters.
 *
 * - Reads the configured locale query key.
 * - Normalizes the value against supported locales.
 *
 * If no valid locale is found, `undefined` is returned.
 *
 * @example
 * ```ts
 * getLocaleFromQuery(config, { locale: "en" })
 * // => "en"
 * getLocaleFromQuery(config, {})
 * // => undefined
 * getLocaleFromQuery(config, { locale: ["zh-TW"] })
 * // => "zh-TW"
 * ```
 */
export function getLocaleFromQuery(
  config: IntorResolvedConfig,
  query: Record<string, string | string[] | undefined> | undefined,
): string | undefined {
  if (!query) return;

  const { supportedLocales, routing } = config;
  const key = routing.locale.queryKey ?? "locale";

  const raw = query[key];
  if (!raw) return;

  const value = Array.isArray(raw) ? raw[0] : raw;

  return normalizeLocale(value, supportedLocales);
}
