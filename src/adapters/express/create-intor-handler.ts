import type { IntorResolvedConfig } from "@/config";
import type { Request, Response, NextFunction } from "express";
import { normalizeQuery } from "@/core";
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
export function createIntorHandler(
  config: IntorResolvedConfig,
  options?: Omit<GetTranslatorParams, "locale" | "fetch" | "allowCacheWrite">,
) {
  return async function intorHandler(
    req: Request,
    _res: Response,
    next: NextFunction,
  ) {
    // Locale from Accept-Language header
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
      {
        host: req.hostname,
        query: normalizeQuery(req.query),
        cookie: parseCookieHeader(req.headers.cookie)[config.cookie.name],
        detected: localeFromAcceptLanguage || config.defaultLocale,
      },
    );

    // --------------------------------------------------
    // Bind inbound routing context
    // --------------------------------------------------
    req.intor = { locale, localeSource, pathname };

    const { hasKey, t, tRich } = await getTranslator(config, {
      locale,
      handlers: options?.handlers,
      plugins: options?.plugins,
      readers: options?.readers,
      allowCacheWrite: true,
    });

    // DX shortcuts (optional)
    req.locale = locale;
    req.hasKey = hasKey;
    req.t = t;
    req.tRich = tRich;

    return next();
  };
}
