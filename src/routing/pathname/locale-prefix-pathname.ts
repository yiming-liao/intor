import type { IntorResolvedConfig } from "@/config";
import { normalizePathname, PREFIX_PLACEHOLDER } from "@/core";

/**
 * Applies the configured locale prefix behavior to a standardized pathname.
 *
 * @example
 * ```ts
 * // config.routing.localePrefix: "all"
 * localePrefixPathname({ config, pathname: "/app/{locale}/about", locale: "en-US" });
 * // => /app/en-US/about
 *
 * // config.routing.localePrefix: "none"
 * localePrefixPathname({ config, pathname: "/app/{locale}/about", locale: "en-US" });
 * // => /app/about
 * ```
 */
export const localePrefixPathname = (
  config: IntorResolvedConfig,
  standardizedPathname: string,
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
      standardizedPathname.replaceAll(PREFIX_PLACEHOLDER, locale!),
    );
  }

  // localePrefix: "except-default"
  if (localePrefix === "except-default") {
    return locale === config.defaultLocale
      ? normalizePathname(
          standardizedPathname.replaceAll(`/${PREFIX_PLACEHOLDER}`, ""),
        )
      : normalizePathname(
          standardizedPathname.replaceAll(PREFIX_PLACEHOLDER, locale!),
        );
  }

  // localePrefix: "none"
  return normalizePathname(
    standardizedPathname.replaceAll(`/${PREFIX_PLACEHOLDER}`, ""),
  );
};
