import type { IntorConfig } from "../../config";
import type { Context, Next } from "hono";
import { getTranslator, type GetTranslatorParams } from "intor/edge";
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
  options?: Omit<GetTranslatorParams, "locale" | "fetch"> & {
    shortcuts?: boolean;
  },
) {
  return async function intorHandler(c: Context, next: Next) {
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
    const cookie = parseCookieHeader(c.req.header("cookie"))[
      config.cookie.name
    ];
    const { locale, localeSource, pathname } = resolveInbound(
      config,
      url.pathname,
      {
        host: url.hostname,
        query: normalizeQuery(Object.fromEntries(url.searchParams)),
        ...(cookie !== undefined ? { cookie } : {}),
        ...(localeFromAcceptLanguage !== undefined
          ? { detected: localeFromAcceptLanguage }
          : {}),
      },
    );

    // --------------------------------------------------
    // Bind inbound routing context
    // --------------------------------------------------
    c.set("intor", { locale, localeSource, pathname });

    const { handlers, plugins } = options ?? {};
    const { hasKey, t, tRich } = await getTranslator(config, {
      locale,
      ...(handlers !== undefined ? { handlers } : {}),
      ...(plugins !== undefined ? { plugins } : {}),
    });

    // DX shortcuts (enabled by default)
    if (options?.shortcuts !== false) {
      c.set("locale", locale);
      c.set("hasKey", hasKey);
      c.set("t", t);
      c.set("tRich", tRich);
    }

    await next();
  };
}
