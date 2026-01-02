import type { IntorResolvedConfig } from "@/config";
import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { INTOR_HEADERS, normalizeQuery } from "@/core";
import { getLocaleFromAcceptLanguage, resolveInbound } from "@/routing";

/**
 * Resolves locale-aware routing for the current execution context.
 *
 * The resolved routing state is exposed via response headers.
 *
 * @platform Next.js
 */
export const intorProxy = async (
  config: IntorResolvedConfig,
  request: NextRequest,
): Promise<Response> => {
  // locale from accept-language header
  const headersStore = await headers();
  const acceptLanguageHeader = headersStore.get("accept-language");
  const localeFromAcceptLanguage = getLocaleFromAcceptLanguage(
    config,
    acceptLanguageHeader,
  );

  // Resolve routing decision (locale + pathname)
  const { locale, localeSource, pathname, shouldRedirect } = resolveInbound(
    config,
    request.nextUrl.pathname,
    {
      host: request.nextUrl.host,
      query: normalizeQuery(
        Object.fromEntries(request.nextUrl.searchParams.entries()),
      ),
      cookie: request.cookies.get(config.cookie.name)?.value,
      detected: localeFromAcceptLanguage || config.defaultLocale,
    },
  );

  // Prepare Next.js response (redirect or pass-through)
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const response = shouldRedirect
    ? NextResponse.redirect(url)
    : NextResponse.next();

  // Attach resolved routing metadata to response headers
  response.headers.set(INTOR_HEADERS.LOCALE, locale);
  response.headers.set(INTOR_HEADERS.LOCALE_SOURCE, localeSource);
  response.headers.set(INTOR_HEADERS.PATHNAME, pathname);

  return response;
};
