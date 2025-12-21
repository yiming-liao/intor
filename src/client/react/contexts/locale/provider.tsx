"use client";

import type { LocaleProviderProps } from "./types";
import * as React from "react";
import { useConfig } from "@/client/react/contexts/config";
import { useInitLocaleCookie } from "@/client/react/contexts/locale/utils/use-init-locale-cookie";
import {
  setLocaleCookieBrowser,
  setDocumentLocale,
} from "@/client/shared/utils";
import { LocaleContext } from "./context";
import { changeLocale } from "./utils/change-locale";

export function LocaleProvider({
  value: { initialLocale, onLocaleChange },
  children,
}: LocaleProviderProps): React.JSX.Element {
  const { config } = useConfig();
  const [locale, setLocaleState] = React.useState<string>(initialLocale);
  const { loader, cookie } = config;

  // Persist the resolved initial locale on first visit.
  useInitLocaleCookie(config, initialLocale);

  // Request a locale change.
  const setLocale = React.useCallback(
    async (newLocale: string) => {
      changeLocale({ locale, newLocale, loader, setLocaleState });
      onLocaleChange?.(newLocale);
    },
    [locale, loader, onLocaleChange],
  );

  // Sync locale-related browser side effects.
  React.useEffect(() => {
    setLocaleCookieBrowser(cookie, locale);
    setDocumentLocale(locale);
  }, [cookie, locale]);

  // context value
  const value = React.useMemo(
    () => ({
      locale,
      setLocale,
    }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
