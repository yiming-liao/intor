import type { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import { cookies, headers } from "next/headers";
import { PATHNAME_HEADER_NAME } from "@/adapters/next/shared/constants/pathname-header-name";
import { I18nContext } from "@/modules/intor/types";
import { getLogger } from "@/shared/logger/get-logger";
import { GenLocale } from "@/shared/types/generated.types";
import { normalizeLocale, resolvePreferredLocale } from "@/shared/utils";

/**
 * Retrieves the i18n context for the current request.
 *
 * Next.js adapter implementation: uses `next/headers` and `next/cookies`.
 */
export const getI18nContext = async <CK extends string = "__default__">(
  config: IntorResolvedConfig,
): Promise<I18nContext> => {
  const baseLogger = getLogger({ id: config.id, ...config.logger });
  const logger = baseLogger.child({ scope: "next-adapter" });

  const cookiesStore = await cookies();
  const headersStore = await headers();

  const { defaultLocale, supportedLocales = [], cookie, routing } = config;
  let locale: string | undefined;

  // Locale from cookie (if cookie is not disabled)
  if (!cookie.disabled) {
    const localeFromCookie = cookiesStore.get(cookie.name)?.value;
    locale = normalizeLocale(localeFromCookie, supportedLocales);
    if (locale) {
      logger.trace("Locale retrieved from cookie.", { locale });
    }
  }

  //====== ▼ Locale from cookie not found ======
  // Locale source set to "browser", retrieve from Accept-Language header
  if (!locale && routing.firstVisit.localeSource === "browser") {
    const aLHeader = headersStore.get("accept-language") || undefined;
    const preferredLocale = resolvePreferredLocale(aLHeader, supportedLocales);
    locale = normalizeLocale(preferredLocale, supportedLocales);
    logger.trace("Locale retrieved from header.", { locale });
  }

  // Retrieve pathname from headers (next/headers)
  const pathname = headersStore.get(PATHNAME_HEADER_NAME);
  if (pathname) {
    logger.trace("Pathname retrieved from header.", { pathname });
  }

  return {
    locale: (locale || defaultLocale) as GenLocale<CK>,
    pathname: pathname || "",
  };
};
