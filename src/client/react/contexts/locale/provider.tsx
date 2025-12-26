"use client";

import * as React from "react";
import { useConfig } from "@/client/react/contexts/config";
import {
  setLocaleCookieBrowser,
  setDocumentLocale,
} from "@/client/shared/utils/locale";
import { LocaleContext } from "./context";

export interface LocaleProviderProps {
  value: {
    initialLocale: string;
    onLocaleChange?: (newLocale: string) => Promise<void> | void;
  };
  children: React.ReactNode;
}

export function LocaleProvider({
  value: { initialLocale, onLocaleChange },
  children,
}: LocaleProviderProps): React.JSX.Element {
  const { config } = useConfig();
  const [locale, setLocaleState] = React.useState<string>(initialLocale);

  // Request a locale change.
  const setLocale = React.useCallback(
    async (newLocale: string) => {
      if (newLocale === locale) return;
      setLocaleState(newLocale);
      onLocaleChange?.(newLocale); // Notify external listener (fire-and-forget)
    },
    [locale, onLocaleChange],
  );

  // Sync locale-related browser side effects.
  React.useEffect(() => {
    setLocaleCookieBrowser(config.cookie, locale);
    setDocumentLocale(locale);
  }, [config.cookie, locale]);

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
