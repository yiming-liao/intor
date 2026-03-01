import type { IntorResolvedConfig } from "../../config";
import type { GetTranslatorParams } from "../../server";
import type { FastifyRequest } from "fastify";
import { getTranslator } from "intor/server";
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
  config: IntorResolvedConfig,
  options?: Omit<
    GetTranslatorParams,
    "locale" | "fetch" | "allowCacheWrite"
  > & { shortcuts?: boolean },
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
    const cookie = parseCookieHeader(request.headers.cookie)[
      config.cookie.name
    ];
    const rawPathname = new URL(request.raw.url ?? "/", "http://localhost")
      .pathname;

    const { locale, localeSource, pathname } = resolveInbound(
      config,
      rawPathname,
      {
        host: request.hostname,
        query: normalizeQuery(request.query as Record<string, unknown>),
        ...(cookie !== undefined ? { cookie } : {}),
        ...(localeFromAcceptLanguage !== undefined
          ? { detected: localeFromAcceptLanguage }
          : {}),
      },
    );

    // --------------------------------------------------
    // Bind inbound routing context
    // --------------------------------------------------
    request.intor = { locale, localeSource, pathname };

    const { loader, handlers, hooks, readers } = options ?? {};
    const { hasKey, t, tRich } = await getTranslator(config, {
      locale,
      ...(loader !== undefined ? { loader } : {}),
      ...(readers !== undefined ? { readers } : {}),
      allowCacheWrite: true,
      ...(handlers !== undefined ? { handlers } : {}),
      ...(hooks !== undefined ? { hooks } : {}),
    });

    // DX shortcuts (enabled by default)
    if (options?.shortcuts !== false) {
      request.locale = locale;
      request.hasKey = hasKey;
      request.t = t;
      request.tRich = tRich;
    }
  };
}
