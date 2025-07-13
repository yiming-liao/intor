import { logry } from "logry";
import { cookies, headers } from "next/headers";
import { DEFAULT_PATHNAME_HEADER_NAME } from "@/adapters/next-client/constants/header-key-constants";
import {
  NextClientRuntimeOptions,
  NextClientRuntimeResult,
} from "@/adapters/next-client/next-client-runtime/next-client-runtime-types";
import { normalizeLocale } from "@/shared/utils/locale/normalize-locale";
import { resolvePreferredLocale } from "@/shared/utils/locale/resolve-preferred-locale";

/**
 * [adapter: next-client] Runtime
 */
export const nextClientRuntime = async ({
  config,
}: NextClientRuntimeOptions): Promise<NextClientRuntimeResult> => {
  const cookiesStore = await cookies();
  const headersStore = await headers();
  const logger = logry({ id: config.id, scope: "nextClientRuntime" });

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

  // Get pathname from headers (next/headers)
  const pathname = headersStore.get(DEFAULT_PATHNAME_HEADER_NAME);
  if (pathname) {
    logger.debug("Get pathname from next headers:", { pathname });
  }

  return {
    locale: locale || defaultLocale,
    pathname: pathname || "",
  };
};
