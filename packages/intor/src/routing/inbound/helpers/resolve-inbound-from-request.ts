import type { IntorConfig } from "../../../config";
import type { InboundContext } from "../types";
import { normalizeQuery, parseCookieHeader } from "../../../core";
import { getLocaleFromAcceptLanguage } from "../../locale";
import { resolveInbound } from "../resolve-inbound";

/**
 * Resolves inbound routing state from a Web standard `Request`.
 *
 * @public
 */
export function resolveInboundFromRequest(
  config: IntorConfig,
  request: Request,
): InboundContext {
  const url = new URL(request.url);
  const headers = request.headers;

  // Cookie
  const cookies = parseCookieHeader(headers.get("cookie") ?? undefined);
  const cookieLocale = cookies[config.cookie.name];

  // Query
  const normalizedQuery = normalizeQuery(Object.fromEntries(url.searchParams));

  // Accept-Language
  const acceptLanguage = headers.get("accept-language") ?? undefined;
  const localeFromAcceptLanguage = getLocaleFromAcceptLanguage(
    acceptLanguage,
    config.supportedLocales,
  );

  const inbounResult = resolveInbound(config, url.pathname, {
    host: url.hostname,
    query: normalizedQuery,
    ...(cookieLocale !== undefined ? { cookie: cookieLocale } : {}),
    ...(localeFromAcceptLanguage !== undefined
      ? { detected: localeFromAcceptLanguage }
      : {}),
  });

  return {
    locale: inbounResult.locale,
    localeSource: inbounResult.localeSource,
    pathname: inbounResult.pathname,
  };
}
