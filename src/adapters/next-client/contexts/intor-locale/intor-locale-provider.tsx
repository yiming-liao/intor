"use client";

import type { IntorLocaleProviderProps } from "./types";
import * as React from "react";
import { changeLocale } from "./utils/change-locale";
import { useIntorConfig } from "@/adapters/next-client/contexts/intor-config";
import { useIntorMessages } from "@/adapters/next-client/contexts/intor-messages";
import { Locale } from "intor-translator";
import { useInitLazyLoad } from "@/adapters/next-client/hooks/intor-locale/use-init-lazy-load";
import { useInitLocaleCookie } from "@/adapters/next-client/hooks/intor-locale/use-init-locale-cookie";
import { IntorLocaleContext } from "./intor-locale-context";

// Provider
export const IntorLocaleProvider = ({
  value: { initialLocale },
  children,
}: IntorLocaleProviderProps): React.JSX.Element => {
  const { config } = useIntorConfig();
  const { refetchMessages } = useIntorMessages();
  const { loaderOptions, cookie } = config;

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
    <IntorLocaleContext.Provider value={value}>
      {children}
    </IntorLocaleContext.Provider>
  );
};
