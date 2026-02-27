import type { IntorConfig } from "../../config";
import type { Request, Response, NextFunction } from "express";
import { getTranslator, type GetTranslatorParams } from "intor/server";
import { normalizeQuery, parseCookieHeader } from "../../core";
import { resolveInbound, getLocaleFromAcceptLanguage } from "../../routing";

/**
 * Resolves locale-aware routing for the current execution context.
 *
 * - Binds resolved routing state to the request.
 * - Optionally binds convenience routing shortcuts for downstream consumption.
 *
 * @public
 */
export function createIntorHandler(
  config: IntorConfig,
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
        ...(localeFromAcceptLanguage !== undefined
          ? { detected: localeFromAcceptLanguage }
          : {}),
      },
    );

    // --------------------------------------------------
    // Bind inbound routing context
    // --------------------------------------------------
    req.intor = { locale, localeSource, pathname };

    const { loader, readers, handlers, plugins } = options ?? {};
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
