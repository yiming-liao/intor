import type { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Locale } from "intor-translator";
import { useRouter as useNextRouter } from "next/navigation";
import { useConfig } from "@/adapters/next/contexts/config";
import { useLocale } from "@/adapters/next/contexts/locale";
import { localizePathname } from "@/adapters/next/shared/utils/localize-pathname";
import { shouldFullReload } from "@/adapters/next/tools/utils/should-full-reload";

export const useRouter = () => {
  const { config } = useConfig();
  const { locale: currentLocale, setLocale } = useLocale();
  const { push, replace, ...rest } = useNextRouter();

  // Push with locale
  const pushWithLocale = (
    href: string,
    options?: NavigateOptions & { locale?: Locale },
  ) => {
    const targetLocale = options?.locale || currentLocale;

    if (options?.locale) {
      const { localePrefixedPathname } = localizePathname({
        config,
        pathname: href,
        locale: targetLocale,
      });
      href = localePrefixedPathname;
    }

    // Using dynamic import or using dynamic API with full reload enabled
    if (shouldFullReload(config.loader)) {
      window.location.href = href; // Full reload navigation
      return;
    } else {
      setLocale(targetLocale); // Update locale without full reload (static messages or API loader with client refetch)
    }
    push(href, options);
  };

  // Replace with locale
  const replaceWithLocale = (
    href: string,
    options?: NavigateOptions & { locale?: Locale },
  ) => {
    const targetLocale = options?.locale || currentLocale;

    if (options?.locale) {
      const { localePrefixedPathname } = localizePathname({
        config,
        pathname: href,
        locale: targetLocale,
      });
      href = localePrefixedPathname;
    }

    // Using dynamic import or using dynamic API with full reload enabled
    if (shouldFullReload(config.loader)) {
      window.location.href = href; // Full reload navigation
      return;
    } else {
      setLocale(targetLocale); // Update locale without full reload (static messages or API loader with client refetch)
    }
    replace(href, options);
  };

  return {
    push: pushWithLocale,
    replace: replaceWithLocale,
    ...rest,
  };
};
