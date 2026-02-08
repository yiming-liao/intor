import type { IntorResolvedConfig } from "@/config";
import type { Context, Next } from "hono";
import { normalizeQuery, parseCookieHeader } from "@/core";
import { resolveInbound, getLocaleFromAcceptLanguage } from "@/routing";

/**
 * Resolves locale-aware routing for the current execution context.
 *
 * - Binds resolved routing state to the request.
 *
 * @platform Hono
 */
export function createIntorHandler(config: IntorResolvedConfig) {
  return async function intorMiddleware(c: Context, next: Next) {
    // Locale from Accept-Language header
    const acceptLanguage = c.req.header("accept-language");
    const localeFromAcceptLanguage = getLocaleFromAcceptLanguage(
      acceptLanguage,
      config.supportedLocales,
    );

    // ----------------------------------------------------------
    // Resolve inbound routing decision (pure computation)
    // ----------------------------------------------------------
    const url = new URL(c.req.url);

    const { locale, localeSource, pathname } = await resolveInbound(
      config,
      url.pathname,
      {
        host: url.hostname,
        query: normalizeQuery(Object.fromEntries(url.searchParams)),
        cookie: parseCookieHeader(c.req.header("cookie"))[config.cookie.name],
        detected: localeFromAcceptLanguage || config.defaultLocale,
      },
    );

    // --------------------------------------------------
    // Bind inbound routing context
    // --------------------------------------------------
    c.set("intor", { locale, localeSource, pathname });

    await next();
  };
}
