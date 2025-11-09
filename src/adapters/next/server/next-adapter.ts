import { cookies, headers } from "next/headers";
import { DEFAULT_PATHNAME_HEADER_NAME } from "@/adapters/next/constants/header-name";
import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import { AdapterRuntime } from "@/modules/intor/types";
import { getLogger } from "@/shared/logger/get-logger";
import { normalizeLocale } from "@/shared/utils/locale/normalize-locale";
import { resolvePreferredLocale } from "@/shared/utils/locale/resolve-preferred-locale";

/**
 * Prepares runtime data for Next.js.
 */
export const nextAdapter = async (
  config: IntorResolvedConfig,
): Promise<AdapterRuntime> => {
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
  const pathname = headersStore.get(DEFAULT_PATHNAME_HEADER_NAME);
  if (pathname) {
    logger.trace("Pathname retrieved from header.", { pathname });
  }

  return {
    locale: locale || defaultLocale,
    pathname: pathname || "",
  };
};
