import type { Locale } from "intor-translator";
import { useConfig } from "@/adapters/next/contexts/config";
import { useLocale } from "@/adapters/next/contexts/locale";
import { usePathname } from "@/adapters/next/navigation/use-pathname";
import { shouldFullReload } from "@/adapters/next/navigation/utils/should-full-reload";
import { localizePathname } from "@/adapters/next/shared/utils/localize-pathname";
import { setLocaleCookieBrowser } from "@/adapters/next/shared/utils/set-locale-cookie-browser";

export const useLocaleSwitch = () => {
  const { config } = useConfig();
  const { locale: currentLocale, setLocale } = useLocale();
  const { localizedPathname } = usePathname();

  // Resolve href
  const resolveHref = ({
    href,
    locale,
  }: {
    href?: string;
    locale?: Locale;
  }) => {
    const isLocaleValid = locale && config.supportedLocales?.includes(locale);
    const targetLocale = isLocaleValid ? locale : currentLocale;
    const targetPathname = href ?? localizedPathname;
    const isExternal = targetPathname.startsWith("http");
    const resolvedHref = !isExternal
      ? localizePathname({
          config,
          pathname: targetPathname,
          locale: targetLocale,
        }).localePrefixedPathname
      : targetPathname;
    return { resolvedHref, isExternal, targetLocale, targetPathname };
  };

  // Switch locale
  const switchLocale = ({
    href,
    locale,
  }: {
    href?: string;
    locale?: Locale;
  }) => {
    const { resolvedHref, isExternal, targetLocale, targetPathname } =
      resolveHref({ href, locale });

    if (isExternal) return;
    if (shouldFullReload({ config, targetPathname, locale, currentLocale })) {
      setLocaleCookieBrowser({ cookie: config.cookie, locale: targetLocale });
      globalThis.location.href = resolvedHref; // Full reload navigation
      return;
    } else {
      setLocale(targetLocale);
    }

    return resolvedHref;
  };

  return { resolveHref, switchLocale };
};
