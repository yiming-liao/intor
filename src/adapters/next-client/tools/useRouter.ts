"use client";

import type { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Locale } from "intor-translator";
import { useRouter as useNextRouter } from "next/navigation";
import { useIntorConfig } from "@/adapters/next-client/contexts/intor-config";
import { useIntorLocale } from "@/adapters/next-client/contexts/intor-locale";
import { localizePathname } from "@/adapters/next-client/utils/localize-pathname";
import { shouldUseFullReload } from "@/adapters/next-client/utils/should-use-full-reload";

export const useRouter = () => {
  const { config } = useIntorConfig();
  const { locale: currentLocale, setLocale } = useIntorLocale();
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
    if (shouldUseFullReload(config.loaderOptions)) {
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
    if (shouldUseFullReload(config.loaderOptions)) {
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
