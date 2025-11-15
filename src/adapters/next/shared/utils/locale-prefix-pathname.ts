import type { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import { PREFIX_PLACEHOLDER } from "@/shared/constants/prefix-placeholder";
import { normalizePathname } from "@/shared/utils";

interface LocalePrefixPathnameOptions {
  pathname: string;
  config: IntorResolvedConfig;
  locale?: string;
}

/**
 * Converts a standardized pathname by applying the locale prefix according to the configured strategy.
 *
 * Based on the `routing.prefix` setting in the config:
 * - "all": Always add the locale prefix.
 * - "except-default": Add the locale prefix unless the locale is the default.
 * - "none": Remove the locale prefix entirely.
 */
export const localePrefixPathname = ({
  config,
  pathname: standardizedPathname,
  locale,
}: LocalePrefixPathnameOptions): string => {
  const { routing } = config;
  const { prefix } = routing;

  if (prefix !== "none" && !locale) {
    throw new Error('No locale when using prefix "all", "except-default"');
  }

  // context: "all"
  if (prefix === "all") {
    return normalizePathname(
      standardizedPathname.replaceAll(PREFIX_PLACEHOLDER, locale!),
    );
  }

  // context: "except-default"
  if (prefix === "except-default") {
    return locale === config.defaultLocale
      ? normalizePathname(
          standardizedPathname.replaceAll(`/${PREFIX_PLACEHOLDER}`, ""),
        )
      : normalizePathname(
          standardizedPathname.replaceAll(PREFIX_PLACEHOLDER, locale!),
        );
  }

  // context: "none"
  return normalizePathname(
    standardizedPathname.replaceAll(`/${PREFIX_PLACEHOLDER}`, ""),
  );
};
