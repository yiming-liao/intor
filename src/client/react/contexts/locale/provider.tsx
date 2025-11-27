"use client";

import type { LocaleProviderProps } from "./types";
import * as React from "react";
import { useConfig } from "@/client/react/contexts/config";
import { useInitLocaleCookie } from "@/client/react/contexts/locale/utils/use-init-locale-cookie";
import { useMessages } from "@/client/react/contexts/messages";
import { LocaleContext } from "./context";
import { changeLocale } from "./utils/change-locale";

// provider
export function LocaleProvider({
  value: { initialLocale, onLocaleChange },
  children,
}: LocaleProviderProps): React.JSX.Element {
  const { config } = useConfig();
  const { refetchMessages } = useMessages();
  const { loader, cookie } = config;

  // Current locale
  const [currentLocale, setCurrentLocale] =
    React.useState<string>(initialLocale);

  useInitLocaleCookie({ config, locale: initialLocale }); // Hook: Initialize cookie (If cookie not exist yet)

  // Change locale and set cookie (If using dynamic api: refetch messages)
  const setLocale = React.useCallback(
    async (newLocale: string) => {
      changeLocale({
        currentLocale,
        newLocale,
        loader,
        cookie,
        setLocale: setCurrentLocale,
        refetchMessages,
      });
      onLocaleChange?.(newLocale);
    },
    [currentLocale, loader, cookie, refetchMessages, onLocaleChange],
  );

  // context value
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
