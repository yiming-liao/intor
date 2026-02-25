import type { IntorResolvedConfig } from "../../config";
import { normalizePathname, LOCALE_PLACEHOLDER } from "../../core";

/**
 * Materializes a standardized pathname by applying
 * the configured locale prefix behavior.
 *
 * @example
 * ```ts
 * // config.routing.localePrefix: "all"
 * materializePathname("/app/{locale}/about", config, "en-US");
 * // => /app/en-US/about
 *
 * // config.routing.localePrefix: "none"
 * materializePathname("/app/{locale}/about", config, "en-US");
 * // => /app/about
 * ```
 */
export const materializePathname = (
  standardizedPathname: string,
  config: IntorResolvedConfig,
  locale?: string,
): string => {
  const { localePrefix } = config.routing;

  if (localePrefix !== "none" && !locale) {
    throw new Error(
      'No locale when using localePrefix "all", "except-default"',
    );
  }

  // localePrefix: "all"
  if (localePrefix === "all") {
    return normalizePathname(
      standardizedPathname.replaceAll(LOCALE_PLACEHOLDER, locale!),
    );
  }

  // localePrefix: "except-default"
  if (localePrefix === "except-default") {
    return locale === config.defaultLocale
      ? normalizePathname(
          standardizedPathname.replaceAll(`/${LOCALE_PLACEHOLDER}`, ""),
        )
      : normalizePathname(
          standardizedPathname.replaceAll(LOCALE_PLACEHOLDER, locale!),
        );
  }

  // localePrefix: "none"
  return normalizePathname(
    standardizedPathname.replaceAll(`/${LOCALE_PLACEHOLDER}`, ""),
  );
};
