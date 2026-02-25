import type { InboundResult } from "./types";
import type { IntorResolvedConfig } from "../../config";
import type { NormalizedQuery } from "../../core";
import {
  getLocaleFromPathname,
  getLocaleFromHost,
  getLocaleFromQuery,
} from "../locale";
import { resolveLocale } from "./resolve-locale";
import { resolvePathname } from "./resolve-path";

interface LocaleInputs {
  host?: string;
  query?: NormalizedQuery;
  cookie?: string;
  detected: string;
}

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
  localeInputs: LocaleInputs,
  options?: { hasRedirected: boolean },
): Promise<InboundResult> {
  const { queryKey } = config.routing.inbound;
  const { host, query, cookie, detected } = localeInputs;

  // ------------------------------------------------------
  // Resolve locale from inbound inputs
  // ------------------------------------------------------
  const pathLocale = getLocaleFromPathname(rawPathname, config);
  const hostLocale = getLocaleFromHost(host);
  const queryLocale = getLocaleFromQuery(query, queryKey);

  const { locale, localeSource } = resolveLocale(config, {
    ...(pathLocale !== undefined && { path: { locale: pathLocale } }),
    ...(hostLocale !== undefined && { host: { locale: hostLocale } }),
    ...(queryLocale !== undefined && { query: { locale: queryLocale } }),
    ...(cookie !== undefined && { cookie: { locale: cookie } }),
    detected: { locale: detected },
  });

  // ------------------------------------------------------
  // Resolve localized pathname and redirect requirement
  // ------------------------------------------------------
  const { pathname, shouldRedirect } = resolvePathname(config, rawPathname, {
    locale,
    hasPathLocale: !!pathLocale,
    hasPersisted: !!cookie,
    hasRedirected: !!options?.hasRedirected,
  });

  return {
    locale,
    localeSource,
    pathname,
    shouldRedirect,
  };
}
