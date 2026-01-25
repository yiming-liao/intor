import type { ResolveInboundResult } from "./types";
import type { IntorResolvedConfig } from "@/config";
import {
  getLocaleFromPathname,
  getLocaleFromHost,
  getLocaleFromQuery,
} from "../locale";
import { resolveLocale } from "./resolve-locale";
import { resolvePathname } from "./resolve-pathname";

/**
 * Resolves inbound routing state.
 *
 * - Resolves the effective locale from inbound inputs
 * - Localizes the pathname based on the resolved locale
 * - Indicates whether a redirect is required
 *
 * No side effects. No navigation.
 */
export async function resolveInbound(
  config: IntorResolvedConfig,
  rawPathname: string,
  hasRedirected: boolean,
  localeInputs: {
    host?: string;
    query?: Record<string, string | string[] | undefined>;
    cookie?: string;
    detected: string;
  },
): Promise<ResolveInboundResult> {
  const { host, query, cookie, detected } = localeInputs;

  // ------------------------------------------------------
  // Resolve locale from inbound inputs
  // ------------------------------------------------------
  const pathLocale = getLocaleFromPathname(rawPathname, config);

  const { locale, localeSource } = resolveLocale(config, {
    path: { locale: pathLocale },
    host: { locale: getLocaleFromHost(host) },
    query: {
      locale: getLocaleFromQuery(query, config.routing.inbound.queryKey),
    },
    cookie: { locale: cookie },
    detected: { locale: detected },
  });

  // ------------------------------------------------------
  // Resolve localized pathname and redirect requirement
  // ------------------------------------------------------
  const { pathname, shouldRedirect } = resolvePathname(config, rawPathname, {
    locale,
    hasPathLocale: !!pathLocale,
    hasPersisted: !!cookie,
    hasRedirected,
  });

  return {
    locale,
    localeSource,
    pathname,
    shouldRedirect,
  };
}
