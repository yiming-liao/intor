import type { NextURL } from "next/dist/server/web/next-url";
import { logry } from "logry";
import { cookies, headers } from "next/headers";
import { DEFAULT_PATHNAME_HEADER_NAME } from "@/adapters/next-client/constants/header-key-constants";
import {
  NextServerRuntimeOptions,
  NextServerRuntimeResult,
} from "@/adapters/next-server/next-server-runtime/next-server-runtime-types";
import { normalizeLocale } from "@/shared/utils/locale/normalize-locale";
import { resolvePreferredLocale } from "@/shared/utils/locale/resolve-preferred-locale";

/**
 * [adapter: next-server] Runtime initialization.
 */
export const nextServerRuntime = async ({
  config,
  request,
}: NextServerRuntimeOptions): Promise<NextServerRuntimeResult> => {
  const cookiesStore = await cookies();
  const headersStore = await headers();
  const logger = logry({ id: config.id, scope: "nextServerRuntime" });

  const { defaultLocale, supportedLocales = [], cookie, routing } = config;
  let locale: string | undefined;

  // Locale from cookie (If cookie not disabled)
  if (!cookie.disabled) {
    const localeFromCookie = cookiesStore.get(cookie.name)?.value;
    locale = normalizeLocale(localeFromCookie, supportedLocales);
    if (locale) {
      logger.debug("Get locale from cookie:", { locale });
    }
  }

  /* ▼ Locale from cookie not found */
  // Locale source setted to "browser", get locale from Accept-Language header
  if (!locale && routing.firstVisit.localeSource === "browser") {
    const aLHeader = headersStore.get("accept-language") || undefined;
    const preferredLocale = resolvePreferredLocale(aLHeader, supportedLocales);
    locale = normalizeLocale(preferredLocale, supportedLocales);
    logger.debug("Get locale from browser:", { locale });
  }

  // Get pathname from next request
  let pathname: null | string = "";
  if (request && typeof request === "object" && "nextUrl" in request) {
    pathname = (request.nextUrl as NextURL).pathname;
    if (pathname) {
      logger.debug("Get pathname from next request:", { pathname });
    }
  }

  /// FALL BACK /// Get pathname from headers (next/headers)
  if (!pathname) {
    pathname = headersStore.get(DEFAULT_PATHNAME_HEADER_NAME);
    if (pathname) {
      logger.debug("Get pathname from next headers:", { pathname });
    }
  }

  // Auto-set cookie
  if (!cookie.disabled && cookie.autoSetCookie) {
    cookiesStore.set({
      name: cookie.name,
      value: locale || defaultLocale,
      ...(cookie.domain ? { domain: cookie.domain } : {}),
      path: cookie.path,
      maxAge: cookie.maxAge,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
    });
    logger.debug("Set locale to cookie:", {
      cookie: { name: cookie.name, value: locale || defaultLocale },
    });
  }

  return {
    locale: locale || defaultLocale,
    pathname: pathname || "",
  };
};
