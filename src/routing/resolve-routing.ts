import type { IntorResolvedConfig } from "@/config";
import type { RoutingLocaleSource } from "@/core/types/routing";
import {
  getLocaleFromPathname,
  getLocaleFromHost,
  getLocaleFromQuery,
} from "@/core/utils";
import { resolveLocale } from "./locale/resolve-locale";
import { resolvePathname } from "./pathname/resolve-pathname";

interface ResolveRoutingResult {
  /** Final resolved locale */
  locale: string;
  /** Source from which the locale was resolved */
  localeSource: RoutingLocaleSource;
  /** Final resolved pathname */
  pathname: string;
  /** Whether a redirect is required */
  shouldRedirect: boolean;
}

/**
 * Resolves routing decision based on locale inputs and routing config.
 *
 * This function orchestrates locale resolution and pathname resolution
 * as a single routing decision step.
 *
 * Responsibilities:
 * - Collect locale candidates from different sources
 * - Resolve the final locale and its source
 * - Resolve the final pathname and redirect behavior
 */
export function resolveRouting(
  config: IntorResolvedConfig,
  pathname: string,
  localeInputs: {
    host?: string;
    query?: Record<string, string | string[] | undefined>;
    cookie?: string;
    detected: string;
  },
): ResolveRoutingResult {
  const { host, query, cookie, detected } = localeInputs;

  // Resolve locale and determine which source was used
  const { locale, localeSource } = resolveLocale(config, {
    path: { locale: getLocaleFromPathname(config, pathname) },
    host: { locale: getLocaleFromHost(config, host) },
    query: { locale: getLocaleFromQuery(config, query) },
    cookie: { locale: cookie },
    detected: { locale: detected },
  });

  // Resolve final pathname and redirect decision
  const { pathname: resolvedPathname, shouldRedirect } = resolvePathname(
    config,
    pathname,
    { locale, localeSource },
  );

  return {
    locale,
    localeSource,
    pathname: resolvedPathname,
    shouldRedirect,
  };
}
