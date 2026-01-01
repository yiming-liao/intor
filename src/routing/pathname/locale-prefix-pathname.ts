import type { IntorResolvedConfig } from "@/config";
import { normalizePathname, PREFIX_PLACEHOLDER } from "@/core";

/**
 * Applies routing prefix strategy by resolving the locale placeholder.
 *
 * @example
 * ```ts
 * // config.routing.prefix: "all"
 * localePrefixPathname({ config, pathname: "/app/{locale}/about", locale: "en-US" });
 * // => /app/en-US/about
 *
 * // config.routing.prefix: "none"
 * localePrefixPathname({ config, pathname: "/app/{locale}/about", locale: "en-US" });
 * // => /app/about
 * ```
 */
export const localePrefixPathname = (
  config: IntorResolvedConfig,
  standardizedPathname: string,
  locale?: string,
): string => {
  const { routing } = config;
  const { prefix } = routing;

  if (prefix !== "none" && !locale) {
    throw new Error('No locale when using prefix "all", "except-default"');
  }

  // prefix: "all"
  if (prefix === "all") {
    return normalizePathname(
      standardizedPathname.replaceAll(PREFIX_PLACEHOLDER, locale!),
    );
  }

  // prefix: "except-default"
  if (prefix === "except-default") {
    return locale === config.defaultLocale
      ? normalizePathname(
          standardizedPathname.replaceAll(`/${PREFIX_PLACEHOLDER}`, ""),
        )
      : normalizePathname(
          standardizedPathname.replaceAll(PREFIX_PLACEHOLDER, locale!),
        );
  }

  // prefix: "none"
  return normalizePathname(
    standardizedPathname.replaceAll(`/${PREFIX_PLACEHOLDER}`, ""),
  );
};
