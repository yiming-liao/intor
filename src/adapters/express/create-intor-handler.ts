import type { IntorResolvedConfig } from "../../config";
import type { Request, Response, NextFunction } from "express";
import { normalizeQuery, parseCookieHeader } from "../../core";
import { resolveInbound, getLocaleFromAcceptLanguage } from "../../routing";
import { getTranslator, type GetTranslatorParams } from "../../server";

/**
 * Resolves locale-aware routing for the current execution context.
 *
 * - Binds resolved routing state to the request.
 * - Convenience routing shortcuts are also bound to the request for downstream consumption.
 *
 * @platform Express
 */
export function createIntorHandler(
  config: IntorResolvedConfig,
  options?: Omit<
    GetTranslatorParams,
    "locale" | "fetch" | "allowCacheWrite"
  > & { shortcuts?: boolean },
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
    const cookie = parseCookieHeader(req.headers.cookie)[config.cookie.name];
    const { locale, localeSource, pathname } = resolveInbound(
      config,
      req.path,
      {
        host: req.hostname,
        query: normalizeQuery(req.query),
        ...(cookie !== undefined ? { cookie } : {}),
        detected: localeFromAcceptLanguage || config.defaultLocale,
      },
    );

    // --------------------------------------------------
    // Bind inbound routing context
    // --------------------------------------------------
    req.intor = { locale, localeSource, pathname };

    const { loader, handlers, plugins, readers } = options ?? {};
    const { hasKey, t, tRich } = await getTranslator(config, {
      locale,
      ...(loader !== undefined ? { loader } : {}),
      ...(readers !== undefined ? { readers } : {}),
      allowCacheWrite: true,
      ...(handlers !== undefined ? { handlers } : {}),
      ...(plugins !== undefined ? { plugins } : {}),
    });

    // DX shortcuts (enabled by default)
    if (options?.shortcuts !== false) {
      req.locale = locale;
      req.hasKey = hasKey;
      req.t = t;
      req.tRich = tRich;
    }

    return next();
  };
}
