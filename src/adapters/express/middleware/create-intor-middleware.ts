import type { IntorResolvedConfig } from "@/config";
import type { Request, Response, NextFunction } from "express";
import type { LocaleMessages, Replacement } from "intor-translator";
import { INTOR_HEADERS, normalizeQuery, type TranslatorInstance } from "@/core";
import { resolveInbound, getLocaleFromAcceptLanguage } from "@/routing";
import {
  parseCookieHeader,
  getTranslator,
  type GetTranslatorParams,
} from "@/server";

/**
 * Resolves locale-aware routing for the current execution context.
 *
 * The resolved routing state is exposed via response headers.
 *
 * - Permits cache writes during server execution.
 * - Convenience routing shortcuts are also bound to the request for downstream consumption.
 *
 * @platform Express
 */
export function createIntorMiddleware(
  config: IntorResolvedConfig,
  options?: Omit<GetTranslatorParams, "locale">,
) {
  return async function intorMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction,
  ) {
    // locale from accept-language header
    const acceptLanguage = req.headers["accept-language"];
    const localeFromAcceptLanguage = getLocaleFromAcceptLanguage(
      acceptLanguage,
      config.supportedLocales,
    );

    // ----------------------------------------------------------
    // Resolve inbound routing decision (pure computation)
    // ----------------------------------------------------------
    const { locale, localeSource, pathname } = await resolveInbound(
      config,
      req.path,
      false,
      {
        host: req.hostname,
        query: normalizeQuery(req.query),
        cookie: parseCookieHeader(req.headers.cookie)[config.cookie.name],
        detected: localeFromAcceptLanguage || config.defaultLocale,
      },
    );

    // --------------------------------------------------
    // Attach routing metadata to response headers
    // --------------------------------------------------
    req.headers[INTOR_HEADERS.LOCALE] = locale;
    req.headers[INTOR_HEADERS.LOCALE_SOURCE] = localeSource;
    req.headers[INTOR_HEADERS.PATHNAME] = pathname;

    // --------------------------------------------------
    // Bind inbound routing context
    // --------------------------------------------------
    const { hasKey, t } = (await getTranslator(config, {
      locale,
      handlers: options?.handlers,
      plugins: options?.plugins,
      readers: options?.readers,
      allowCacheWrite: true,
    })) as TranslatorInstance<LocaleMessages, Replacement, "string">;

    req.intor = { locale, localeSource, pathname };

    // DX shortcuts (optional)
    req.locale = locale;
    req.hasKey = hasKey;
    req.t = t;

    return next();
  };
}
