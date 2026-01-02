import type { IntorResolvedConfig } from "@/config";
import type { Locale } from "intor-translator";
import { isExternalDestination } from "@/core";
import { localizePathname } from "../pathname";

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
export function deriveNavigationTarget(
  config: IntorResolvedConfig,
  currentLocale: Locale,
  currentPathname: string,
  options?: { destination?: string; locale?: Locale },
): NavigationTarget {
  const { supportedLocales, routing } = config;

  // 1. Resolve effective locale (explicit override > current context)
  const locale =
    options?.locale && supportedLocales.includes(options?.locale)
      ? options?.locale
      : currentLocale;

  // 2. Resolve raw destination and detect external navigation
  const rawDestination = options?.destination ?? currentPathname;
  const isExternal = isExternalDestination(rawDestination);

  // 3. Project destination according to navigation representation
  let destination = rawDestination;

  if (!isExternal) {
    switch (routing.navigation.representation) {
      case "path": {
        destination = localizePathname(config, rawDestination, locale).pathname;
        break;
      }
      // case "host": {
      //   const host = resolveHostForLocale(config, locale);
      //   destination = `https://${host}${rawDestination}`;
      //   break;
      // }
      // case "query": {
      //   const url = new URL(rawDestination, "http://internal");
      //   url.searchParams.set(
      //     config.routing.navigation.queryKey ?? "lang",
      //     locale,
      //   );
      //   destination = `${url.pathname}${url.search}`;
      //   break;
      // }
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
