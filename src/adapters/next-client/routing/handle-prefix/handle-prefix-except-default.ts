import type { NextRequest } from "next/server";
import { createResponse } from "@/adapters/next-client/routing/utils/create-response";
import { determineInitialLocale } from "@/adapters/next-client/routing/utils/determine-initial-locale";
import { IntorResolvedConfig } from "@/modules/intor-config/types/define-intor-config-types";
import { extractPathname } from "@/shared/utils/pathname/extract-pathname";

type Params = {
  request: NextRequest;
  config: IntorResolvedConfig;
};

/**
 * Handle routing for "except-default" prefix.
 *
 * - If URL has a non-default locale prefix → use it and override cookie.
 * - If no prefix and no cookie:
 *   - If redirect disabled → respond directly.
 *   - If redirect enabled:
 *     - If resolved locale is default → respond directly.
 *     - Else → redirect to locale URL.
 * - If no prefix but cookie exists:
 *   - If cookie locale is default → respond directly.
 *   - Else → redirect to locale URL.
 *
 * @param params - Request and i18n config.
 * @returns Response with or without redirect.
 */
export const handlePrefixExceptDefault = async ({
  request,
  config,
}: Params): Promise<Response> => {
  const { defaultLocale, cookie, routing } = config;
  const { maybeLocale, isLocalePrefixed } = extractPathname({
    config,
    pathname: request.nextUrl.pathname,
  });
  const localeFromCookie = request.cookies.get(cookie.name)?.value;

  // ▼ URL has a locale prefix, and it's not defaultLocale (e.g. https://example.com/zh)

  if (isLocalePrefixed && maybeLocale !== defaultLocale) {
    // ▶ Go directly and override cookie
    return createResponse({
      request,
      config,
      locale: maybeLocale,
      setCookieOptions: { override: true },
    });
  }

  // ▼ URL doesn't have a locale prefix, (e.g. https://example.com/)

  // No cookie, so is first visit
  if (!localeFromCookie) {
    // Not using redirect (Do not set cookie)
    if (!routing.firstVisit.redirect) {
      // ▶ Go directly
      return createResponse({ request, config });
    }

    // Using redirect for the first visit
    // Decide to use locale from browser or defaultLocale
    const initialLocale = await determineInitialLocale(config);
    const isDefaultLocale = initialLocale === defaultLocale;

    // Is defaultLocale
    if (isDefaultLocale) {
      // ▶ Go directly, no prefix (set cookie for the first visit)
      return createResponse({
        request,
        config,
        locale: defaultLocale,
      });
    }
    // Not defaultLocale
    // ▶ Redirect to URL (set cookie for the first visit)
    return createResponse({
      request,
      config,
      locale: initialLocale, // Use locale from 'browser' | 'default'
      responseType: "redirect",
    });
  }

  // Cookie found (No need to set cookie)
  const isDefaultLocale = localeFromCookie === defaultLocale;

  if (isDefaultLocale) {
    // ▶ Go directly
    return createResponse({ request, config, locale: localeFromCookie });
  }

  // ▶ Redirect to URL
  return createResponse({
    request,
    config,
    locale: localeFromCookie, // Use locale from cookie
    responseType: "redirect",
  });
};
