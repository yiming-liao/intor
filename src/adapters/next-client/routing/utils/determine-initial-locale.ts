import { headers } from "next/headers";
import { IntorResolvedConfig } from "@/modules/intor-config/types/define-intor-config-types";
import { normalizeLocale } from "@/shared/utils/locale/normalize-locale";
import { resolvePreferredLocale } from "@/shared/utils/locale/resolve-preferred-locale";

/**
 * Determine the initial locale for the user.
 *
 * @param config - The resolved configuration object.
 * @returns The initial locale string.
 */
export const determineInitialLocale = async (config: IntorResolvedConfig) => {
  const { defaultLocale, supportedLocales, routing } = config;
  let initialLocale = defaultLocale;

  // If locale should be determined from browser on first visit
  if (routing.firstVisit.localeSource === "browser") {
    const acceptLanguageHeader =
      (await headers()).get("accept-language") || undefined;

    // Find the best matching locale from the supported locales
    const preferredLocale = resolvePreferredLocale(
      acceptLanguageHeader,
      supportedLocales,
    );

    // Normalize the preferred locale or fallback to default
    initialLocale =
      normalizeLocale(preferredLocale, supportedLocales) || defaultLocale;
  }

  return initialLocale;
};
