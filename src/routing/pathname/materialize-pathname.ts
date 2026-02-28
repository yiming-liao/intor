import type { IntorResolvedConfig } from "../../config";
import { LOCALE_PLACEHOLDER } from "../../core";

/**
 * Materializes a standardized pathname into a concrete, locale-aware URL.
 *
 * This function resolves the `{locale}` placeholder according to the
 * configured `localePrefix` strategy and produces the final pathname.
 *
 * Behavior:
 * - "all": always injects the locale segment
 * - "except-default": injects the locale unless it equals `defaultLocale`
 * - "none": removes the locale placeholder entirely
 *
 * Invariants:
 * - `standardizedPathname` must be produced by `standardizePathname`
 * - The pathname must contain exactly one `{locale}` placeholder
 * - The placeholder must appear as the first path segment
 *
 * This function performs structural transformation only.
 * It does not normalize or sanitize the resulting pathname.
 *
 * @example
 * ```ts
 * // config.routing.localePrefix: "all"
 * materializePathname("/app/{locale}/about", config, "en");
 * // => /app/en/about
 *
 * // config.routing.localePrefix: "none"
 * materializePathname("/app/{locale}/about", config, "en");
 * // => /app/about
 * ```
 */
export const materializePathname = (
  standardizedPathname: string,
  config: IntorResolvedConfig,
  locale: string,
): string => {
  const { localePrefix } = config.routing;

  const removeLocale = () => {
    const result = standardizedPathname.replace(`/${LOCALE_PLACEHOLDER}`, "");
    return result === "" ? "/" : result;
  };

  const injectLocale = () =>
    standardizedPathname.replace(LOCALE_PLACEHOLDER, locale);

  // localePrefix: "none"
  if (localePrefix === "none") return removeLocale();

  // localePrefix: "all"
  if (localePrefix === "all") return injectLocale();

  // localePrefix: "except-default"
  return locale === config.defaultLocale ? removeLocale() : injectLocale();
};
