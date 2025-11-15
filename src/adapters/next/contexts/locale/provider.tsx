"use client";

import type { LocaleProviderProps } from "./types";
import type { Locale } from "intor-translator";
import * as React from "react";
import { useConfig } from "@/adapters/next/contexts/config";
import { useInitLazyLoad } from "@/adapters/next/contexts/locale/utils/use-init-lazy-load";
import { useInitLocaleCookie } from "@/adapters/next/contexts/locale/utils/use-init-locale-cookie";
import { useMessages } from "@/adapters/next/contexts/messages";
import { LocaleContext } from "./context";
import { changeLocale } from "./utils/change-locale";

// Provider
export function LocaleProvider({
  value: { initialLocale },
  children,
}: LocaleProviderProps): React.JSX.Element {
  const { config } = useConfig();
  const { refetchMessages } = useMessages();
  const { loader: loaderOptions, cookie } = config;

  // Current locale
  const [currentLocale, setCurrentLocale] =
    React.useState<Locale>(initialLocale);

  useInitLazyLoad({ loaderOptions, currentLocale }); // Hook: Fetch messages from api at the first time if using lazy load
  useInitLocaleCookie({ config, locale: initialLocale }); // Hook: Initialize cookie (If cookie not exist yet)

  // Change locale and set cookie (If using dynamic api: refetch messages)
  const setLocale = React.useCallback(
    (newLocale: Locale) => {
      changeLocale({
        currentLocale,
        newLocale,
        loaderOptions,
        cookie,
        setLocale: setCurrentLocale,
        refetchMessages,
      });
    },
    [currentLocale, loaderOptions, cookie, refetchMessages],
  );

  // Context value
  const value = React.useMemo(
    () => ({
      locale: currentLocale,
      setLocale,
    }),
    [currentLocale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
