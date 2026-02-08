import type { IntorResolvedConfig } from "@/config";
import type { FastifyRequest } from "fastify";
import { normalizeQuery, parseCookieHeader } from "@/core";
import { resolveInbound, getLocaleFromAcceptLanguage } from "@/routing";
import { getTranslator, type GetTranslatorParams } from "@/server";

/**
 * Resolves locale-aware routing for the current execution context.
 *
 * - Binds resolved routing state to the request.
 * - Convenience routing shortcuts are also bound to the request for downstream consumption.
 *
 * @platform Fastify
 */
export function createIntorHandler(
  config: IntorResolvedConfig,
  options?: Omit<GetTranslatorParams, "locale" | "fetch" | "allowCacheWrite">,
) {
  return async function intorHandler(request: FastifyRequest) {
    // Locale from Accept-Language header
    const acceptLanguage = request.headers["accept-language"];
    const localeFromAcceptLanguage = getLocaleFromAcceptLanguage(
      acceptLanguage,
      config.supportedLocales,
    );

    // ----------------------------------------------------------
    // Resolve inbound routing decision (pure computation)
    // ----------------------------------------------------------
    const { locale, localeSource, pathname } = await resolveInbound(
      config,
      request.raw.url?.split("?")[0] ?? "/",
      {
        host: request.hostname,
        query: normalizeQuery(request.query as Record<string, unknown>),
        cookie: parseCookieHeader(request.headers.cookie)[config.cookie.name],
        detected: localeFromAcceptLanguage || config.defaultLocale,
      },
    );

    // --------------------------------------------------
    // Bind inbound routing context
    // --------------------------------------------------
    request.intor = { locale, localeSource, pathname };

    const { hasKey, t, tRich } = await getTranslator(config, {
      locale,
      handlers: options?.handlers,
      plugins: options?.plugins,
      readers: options?.readers,
      allowCacheWrite: true,
    });

    // DX shortcuts (optional)
    request.locale = locale;
    request.hasKey = hasKey;
    request.t = t;
    request.tRich = tRich;
  };
}
