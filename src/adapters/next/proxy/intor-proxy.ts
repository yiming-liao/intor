import type { IntorResolvedConfig } from "@/config";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { INTOR_HEADERS, normalizeQuery } from "@/core";
import { getLocaleFromAcceptLanguage, resolveInbound } from "@/routing";

/**
 * Resolves locale-aware routing for the current execution context.
 *
 * The resolved routing state is exposed via response headers.
 *
 * - Acts as the canonical routing authority, guaranteeing a canonical routing result for every request.
 *
 * @platform Next.js
 */
export const intorProxy = async (
  config: IntorResolvedConfig,
  request: NextRequest,
): Promise<Response> => {
  // locale from accept-language header
  const acceptLanguageHeader = request.headers.get("accept-language");
  const localeFromAcceptLanguage = getLocaleFromAcceptLanguage(
    acceptLanguageHeader,
    config.supportedLocales,
  );

  // Check whether this navigation flow has already redirected
  const hasRedirectedForLocale =
    request.headers.get("x-intor-redirected") === "1";

  // ----------------------------------------------------------
  // Resolve inbound routing decision (pure computation)
  // ----------------------------------------------------------
  const { locale, localeSource, pathname, shouldRedirect } =
    await resolveInbound(
      config,
      request.nextUrl.pathname,
      hasRedirectedForLocale,
      {
        host: request.nextUrl.host,
        query: normalizeQuery(
          Object.fromEntries(request.nextUrl.searchParams.entries()),
        ),
        cookie: request.cookies.get(config.cookie.name)?.value,
        detected: localeFromAcceptLanguage || config.defaultLocale,
      },
    );

  // ----------------------------------------------------------
  // Prepare Next.js response (redirect or pass-through)
  // ----------------------------------------------------------
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const response = shouldRedirect
    ? NextResponse.redirect(url)
    : NextResponse.next();

  // ----------------------------------------------------------
  // Attach routing metadata to response headers
  // ----------------------------------------------------------
  response.headers.set(INTOR_HEADERS.LOCALE, locale);
  response.headers.set(INTOR_HEADERS.LOCALE_SOURCE, localeSource);
  response.headers.set(INTOR_HEADERS.PATHNAME, pathname);
  // Mark redirect to prevent infinite loops in this flow
  if (shouldRedirect) response.headers.set(INTOR_HEADERS.REDIRECTED, "1");

  return response;
};
