import type { Locale } from "intor-translator";
import { usePathname } from "@/adapters/next/navigation/use-pathname";
import { shouldFullReload } from "@/adapters/next/navigation/utils/should-full-reload";
import { useConfig } from "@/client/react/contexts/config";
import { useLocale } from "@/client/react/contexts/locale";
import { setLocaleCookieBrowser } from "@/client/shared/utils";
import { localizePathname } from "@/shared/utils/routing/localize-pathname";

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
        }).localizedPathname
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
      setLocaleCookieBrowser(config.cookie, targetLocale);
      globalThis.location.href = resolvedHref; // Full reload navigation
      return;
    } else {
      setLocale(targetLocale);
    }

    return resolvedHref;
  };

  return { resolveHref, switchLocale };
};
