import type { IntorResolvedConfig } from "@/config";
import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getLocaleFromAcceptLanguage } from "@/core";
import { buildCookieOptions } from "@/core/utils/build-cookie-options";
import { normalizeQuery } from "@/core/utils/normalizers/normalize-query";
import { shouldPersist, shouldPersistOnFirstVisit } from "@/policies";
import { resolveRouting } from "@/routing";

/**
 * Next.js routing adapter for Intor.
 *
 * Responsibilities:
 * - Collect locale candidates from request-related sources
 * - Delegate routing decisions to the routing core
 * - Apply redirect behavior when required
 * - Materialize routing decisions into persistent state (cookie)
 *   with configurable first-visit behavior
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
    acceptLanguageHeader,
  );

  // Resolve routing decision (locale + pathname)
  const { locale, localeSource, pathname, shouldRedirect } = resolveRouting(
    config,
    request.nextUrl.pathname,
    {
      host: request.nextUrl.host,
      query: normalizeQuery(
        Object.fromEntries(request.nextUrl.searchParams.entries()),
      ),
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

  // Persist resolved locale to cookie
  const isFirstVisit = localeSource === "detected";
  if (
    shouldPersistOnFirstVisit(isFirstVisit, routing.firstVisit.persist) &&
    shouldPersist(cookie)
  ) {
    response.cookies.set(cookie.name, locale, buildCookieOptions(cookie));
  }

  return response;
};
