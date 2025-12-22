import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type { I18nContext } from "@/server/intor/types";
import type { GenConfigKeys, GenLocale } from "@/shared/types/generated";
import { cookies, headers } from "next/headers";
import { getLogger } from "@/server/shared/logger/get-logger";
import { normalizeLocale, getLocaleFromAcceptLanguage } from "@/shared/utils";

/**
 * Resolve the locale for the current Next.js request.
 */
export const getI18nContext = async <CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
): Promise<I18nContext<CK>> => {
  const baseLogger = getLogger({ id: config.id, ...config.logger });
  const logger = baseLogger.child({ scope: "next-adapter" });

  const cookiesStore = await cookies();
  const headersStore = await headers();

  const { defaultLocale, supportedLocales = [], cookie, routing } = config;
  let locale: string | undefined;

  // Try cookie first when cookie support is enabled
  if (cookie.enabled) {
    const localeFromCookie = cookiesStore.get(cookie.name)?.value;
    locale = normalizeLocale(localeFromCookie, supportedLocales);
    if (locale) {
      logger.trace(`Locale resolved from cookie: ${locale}`);
    }
  }

  // Fallback to browser preference on first visit
  if (!locale && routing.firstVisit.localeSource === "browser") {
    const acceptLanguageHeader = headersStore.get("accept-language");
    const localeFromAcceptLanguage = getLocaleFromAcceptLanguage(
      acceptLanguageHeader || undefined,
      supportedLocales,
    );
    locale = normalizeLocale(localeFromAcceptLanguage, supportedLocales);
    logger.trace(`Locale resolved from Accept-Language header: ${locale}`);
  }

  // Always ensure a valid locale
  return {
    locale: (locale || defaultLocale) as GenLocale<CK>,
  };
};
