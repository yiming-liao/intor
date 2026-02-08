import type { InboundResult } from "../types";
import type { IntorResolvedConfig } from "@/config";
import { normalizeQuery, parseCookieHeader } from "@/core";
import { getLocaleFromAcceptLanguage } from "../../locale";
import { resolveInbound } from "../resolve-inbound";

export async function resolveInboundFromRequest(
  config: IntorResolvedConfig,
  request: Request,
): Promise<InboundResult> {
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
    cookie: cookieLocale,
    detected: localeFromAcceptLanguage || config.defaultLocale,
  });
}
