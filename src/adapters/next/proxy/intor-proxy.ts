import type { IntorResolvedConfig } from "@/config";
import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { setLocaleCookieEdge } from "@/adapters/next/proxy/utils/set-locale-cookie-edge";
import { resolveRouting } from "@/routing";
import { getLocaleFromAcceptLanguage } from "@/shared/utils";

/**
 * Next.js routing adapter for Intor.
 *
 * Responsibilities:
 * - Collect locale candidates from request-related sources
 * - Delegate routing decisions to the routing core
 * - Apply redirect behavior when required
 * - Persist locale on first visit when configured
 */
export const intorProxy = async (
  config: IntorResolvedConfig,
  request: NextRequest,
): Promise<Response> => {
  const { defaultLocale, cookie, routing } = config;

  // locale from accept-language header
  const headersStore = await headers();
  const acceptLanguageHeader = headersStore.get("accept-language");
  const localeFromAcceptLanguage = getLocaleFromAcceptLanguage(
    config,
    acceptLanguageHeader || undefined,
  );

  // Resolve routing decision (locale + pathname)
  const { locale, localeSource, pathname, shouldRedirect } = resolveRouting(
    config,
    request.nextUrl.pathname,
    {
      host: request.nextUrl.host,
      query: Object.fromEntries(request.nextUrl.searchParams.entries()),
      cookie: request.cookies.get(config.cookie.name)?.value,
      detected: localeFromAcceptLanguage || defaultLocale,
    },
  );

  // Prepare Next.js response (redirect or pass-through)
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const response = shouldRedirect
    ? NextResponse.redirect(url)
    : NextResponse.next();

  // Persist locale on first visit if enabled
  const isFirstVisit = localeSource === "detected";
  if (isFirstVisit && routing.firstVisit.persist) {
    setLocaleCookieEdge({ response, locale, cookie });
  }

  return response;
};
