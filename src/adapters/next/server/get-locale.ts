import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenLocale } from "@/core";
import { cookies, headers } from "next/headers";
import { getLocaleFromAcceptLanguage } from "@/core";
import { resolveLocale } from "@/routing";

/**
 * Get the locale for the current execution context.
 *
 * @platform Next.js
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
    acceptLanguageHeader,
  );

  // Resolve locale and determine which source was used
  const { locale } = resolveLocale(config, {
    cookie: { locale: cookieFromLocale },
    detected: { locale: localeFromAcceptLanguage || defaultLocale },
  });

  return locale as GenLocale<CK>;
};
