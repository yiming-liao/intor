import type { IntorResolvedConfig } from "@/config";
import type { Locale } from "intor-translator";
import { getUnprefixedPathname } from "@/routing/pathname/get-unprefixed-pathname";
import { localizePathname } from "../pathname";
import { deriveHostDestination } from "./utils/derive-host-destination";
import { deriveQueryDestination } from "./utils/derive-query-destination";
import { isExternalDestination } from "./utils/is-external-destination";

export interface NavigationTarget {
  locale: Locale;
  destination: string;
  isExternal: boolean;
}

/**
 * Derives a navigation target for a single navigation attempt.
 *
 * This function computes the final destination URL and execution flags
 * based on the current routing configuration and locale context.
 */
export function deriveTarget(
  config: IntorResolvedConfig,
  currentLocale: Locale,
  currentPathname: string,
  intent?: { destination?: string; locale?: Locale },
): NavigationTarget {
  const { supportedLocales, routing } = config;

  // ----------------------------------------------------------------
  // Resolve effective locale
  // ----------------------------------------------------------------
  const locale =
    intent?.locale && supportedLocales.includes(intent?.locale)
      ? intent?.locale
      : currentLocale;

  // ----------------------------------------------------------------
  // Resolve raw destination and external flag
  // ----------------------------------------------------------------
  // Use the unprefixed logical path as the navigation base.
  // Locale prefixes are applied later by inbound canonicalization.
  const rawDestination =
    intent?.destination ?? getUnprefixedPathname(config, currentPathname);
  const isExternal = isExternalDestination(rawDestination);

  // ----------------------------------------------------------------
  // Project destination by navigation carrier
  // ----------------------------------------------------------------
  let destination = rawDestination;
  if (!isExternal) {
    switch (routing.outbound.localeCarrier) {
      case "path": {
        destination = localizePathname(config, rawDestination, locale).pathname;
        break;
      }
      case "host": {
        destination = deriveHostDestination(config, rawDestination, locale);
        break;
      }
      case "query": {
        destination = deriveQueryDestination(config, rawDestination, locale);
        break;
      }
      default: {
        destination = rawDestination;
      }
    }
  }

  return {
    locale,
    destination,
    isExternal,
  };
}
