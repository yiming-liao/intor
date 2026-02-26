import type { IntorResolvedConfig } from "../../../config";
import type { InboundResult } from "../types";
import { normalizeQuery, parseCookieHeader } from "../../../core";
import { getLocaleFromAcceptLanguage } from "../../locale";
import { resolveInbound } from "../resolve-inbound";

export function resolveInboundFromRequest(
  config: IntorResolvedConfig,
  request: Request,
): InboundResult {
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

  return resolveInbound(config, url.pathname, {
    host: url.hostname,
    query: normalizedQuery,
    ...(cookieLocale !== undefined ? { cookie: cookieLocale } : {}),
    detected: localeFromAcceptLanguage || config.defaultLocale,
  });
}
