import type { IntorConfig } from "../../config";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { normalizeQuery } from "../../core";
import { getLocaleFromAcceptLanguage, resolveInbound } from "../../routing";
import { INTOR_HEADER_KEYS } from "./header-keys";

/**
 * Resolves locale-aware routing for the current execution context.
 *
 * The resolved routing state is exposed via response headers.
 *
 * - Acts as the canonical routing authority, guaranteeing a canonical routing result for every request.
 *
 * @public
 */
export function createIntorHandler(config: IntorConfig) {
  return function intorHandler(request: NextRequest) {
    const {
      host,
      searchParams,
      pathname: rawPathname,
      search,
    } = request.nextUrl;

    // Locale from Accept-Language header
    const acceptLanguageHeader = request.headers.get("accept-language");
    const localeFromAcceptLanguage = getLocaleFromAcceptLanguage(
      acceptLanguageHeader,
      config.supportedLocales,
    );

    // Check whether this navigation flow has already redirected
    const hasRedirected =
      request.headers.get(INTOR_HEADER_KEYS.REDIRECTED) === "1";

    // ----------------------------------------------------------
    // Resolve inbound routing decision (pure computation)
    // ----------------------------------------------------------
    const cookie = request.cookies.get(config.cookie.name)?.value;
    const { locale, localeSource, pathname, shouldRedirect } = resolveInbound(
      config,
      rawPathname,
      {
        host,
        query: normalizeQuery(Object.fromEntries(searchParams.entries())),
        ...(cookie !== undefined ? { cookie } : {}),
        ...(localeFromAcceptLanguage !== undefined
          ? { detected: localeFromAcceptLanguage }
          : {}),
      },
      { hasRedirected },
    );

    // ----------------------------------------------------------
    // Prepare Next.js response (redirect or pass-through)
    // ----------------------------------------------------------
    const url = request.nextUrl.clone();
    if (shouldRedirect) {
      url.pathname = pathname;
      url.search = search;
    }
    const response = shouldRedirect
      ? NextResponse.redirect(url)
      : NextResponse.next();

    // ----------------------------------------------------------
    // Attach routing metadata to response headers
    // ----------------------------------------------------------
    response.headers.set(INTOR_HEADER_KEYS.LOCALE, locale);
    response.headers.set(INTOR_HEADER_KEYS.LOCALE_SOURCE, localeSource);
    response.headers.set(INTOR_HEADER_KEYS.PATHNAME, pathname);
    response.headers.set(INTOR_HEADER_KEYS.SEARCH, search);
    // Mark redirect to prevent infinite loops in this flow
    if (shouldRedirect) response.headers.set(INTOR_HEADER_KEYS.REDIRECTED, "1");

    return response;
  };
}
