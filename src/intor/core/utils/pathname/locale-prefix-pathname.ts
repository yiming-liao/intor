import type { IntorResolvedConfig } from "../../../core/intor-config/types/define-intor-config-types";
import type { LocalizedPathname } from "../../../types/pathname-types";

type LocalePrefixPathnameOptions = {
  pathname: string;
  config: IntorResolvedConfig;
  locale?: string;
};

/**
 * Converts a standardized pathname by applying the locale prefix according to the configured strategy.
 *
 * Based on the `routing.prefix` setting in the config:
 * - "all": Always add the locale prefix.
 * - "except-default": Add the locale prefix unless the locale is the default.
 * - "none": Remove the locale prefix entirely.
 *
 * @param {Object} options - Options for locale prefixing.
 * @param {string} options.pathname - The standardized pathname to be processed.
 * @param {IntorResolvedConfig} options.config - Configuration containing routing settings.
 * @param {string} options.locale - The locale to apply.
 *
 * @returns {string} The pathname with the applied locale prefix.
 */
export const localePrefixPathname = ({
  config,
  pathname: standardizedPathname,
  locale,
}: LocalePrefixPathnameOptions): LocalizedPathname => {
  const { routing, prefixPlaceHolder } = config;
  const { prefix } = routing;

  if (prefix !== "none" && !locale) {
    throw new Error('No locale when using prefix "all", "except-default"');
  }

  // Prefix: "all"
  if (prefix === "all") {
    return standardizedPathname.replace(prefixPlaceHolder, locale!);
  }

  // Prefix: "except-default"
  if (prefix === "except-default") {
    if (locale === config.defaultLocale) {
      return standardizedPathname.replace(`/${prefixPlaceHolder}`, "");
    } else {
      return standardizedPathname.replace(prefixPlaceHolder, locale!);
    }
  }

  // Prefix: "none"
  return standardizedPathname.replace(`/${prefixPlaceHolder}`, "");
};
