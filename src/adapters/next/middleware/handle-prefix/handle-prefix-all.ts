import type { NextRequest } from "next/server";
import { createResponse } from "@/adapters/next/middleware/utils/create-response";
import { determineInitialLocale } from "@/adapters/next/middleware/utils/determine-initial-locale";
import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import { extractPathname } from "@/shared/utils";

interface Params {
  request: NextRequest;
  config: IntorResolvedConfig;
}

/**
 * Handle routing for "all" prefix.
 *
 * - If URL has locale prefix → use it and override cookie.
 * - If no prefix and no cookie:
 *   - If redirect disabled → respond directly.
 *   - If redirect enabled → detect initial locale and redirect.
 * - If no prefix but cookie exists → redirect using cookie locale.
 */
export const handlePrefixAll = async ({
  request,
  config,
}: Params): Promise<Response> => {
  const { cookie, routing } = config;
  const { maybeLocale, isLocalePrefixed } = extractPathname({
    config,
    pathname: request.nextUrl.pathname,
  });
  const localeFromCookie = request.cookies.get(cookie.name)?.value;

  // ▼ URL has a locale prefix, (e.g. https://example.com/en)

  if (isLocalePrefixed) {
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

    // Decide to use locale from browser or defaultLocale
    const initialLocale = await determineInitialLocale(config);

    // Using redirect for the first visit
    // ▶ Redirect to URL (set cookie for the first visit)
    return createResponse({
      request,
      config,
      locale: initialLocale, // Use locale from 'browser' | 'default'
      responseType: "redirect",
    });
  }

  // ▶ Redirect to URL
  return createResponse({
    request,
    config,
    locale: localeFromCookie, // Use locale from cookie
    responseType: "redirect",
  });
};
