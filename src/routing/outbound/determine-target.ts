import type { IntorResolvedConfig } from "@/config";
import type { Locale } from "intor-translator";
import { canonicalizePathname } from "@/routing/pathname/canonicalize-pathname";
import { localizePathname } from "../pathname";
import { deriveHostDestination } from "./utils/derive-host-destination";
import { deriveQueryDestination } from "./utils/derive-query-destination";
import { isExternalDestination } from "./utils/is-external-destination";

export interface OutboundTarget {
  locale: Locale;
  destination: string;
  isExternal: boolean;
}

/**
 * Determines the outbound routing target.
 */
export function determineTarget(
  config: IntorResolvedConfig,
  currentLocale: Locale,
  currentPathname: string,
  intent?: { destination?: string; locale?: Locale },
): OutboundTarget {
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
    intent?.destination ?? canonicalizePathname(currentPathname, config);
  const isExternal = isExternalDestination(rawDestination);

  // ----------------------------------------------------------------
  // Project destination by navigation carrier
  // ----------------------------------------------------------------
  let destination = rawDestination;
  if (!isExternal) {
    switch (routing.outbound.localeCarrier) {
      case "path": {
        destination = localizePathname(rawDestination, config, locale).pathname;
        break;
      }
      case "host": {
        destination = deriveHostDestination(rawDestination, config, locale);
        break;
      }
      case "query": {
        destination = deriveQueryDestination(rawDestination, config, locale);
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
