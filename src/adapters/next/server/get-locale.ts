import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type { GenConfigKeys, GenLocale } from "@/shared/types/generated";
import { cookies, headers } from "next/headers";
import { resolveLocale } from "@/routing/locale";
import { getLocaleFromAcceptLanguage } from "@/shared/utils";

/**
 * Get the locale for the current Next.js request.
 */
export const getLocale = async <CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
): Promise<GenLocale<CK>> => {
  const { defaultLocale, cookie } = config;

  // Locale from cookie
  const cookiesStore = await cookies();
  const cookieFromLocale = cookiesStore.get(cookie.name)?.value;

  // locale from accept-language header
  const headersStore = await headers();
  const acceptLanguageHeader = headersStore.get("accept-language");
  const localeFromAcceptLanguage = getLocaleFromAcceptLanguage(
    config,
    acceptLanguageHeader || undefined,
  );

  // Resolve locale and determine which source was used
  const { locale } = resolveLocale(config, {
    cookie: { locale: cookieFromLocale },
    detected: { locale: localeFromAcceptLanguage || defaultLocale },
  });

  return locale as GenLocale<CK>;
};
