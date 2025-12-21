import type { Locale } from "intor-translator";
import type * as React from "react";

// provider props
export type LocaleProviderProps = {
  value: {
    initialLocale: string;
    onLocaleChange?: (newLocale: string) => Promise<void> | void;
  };
  children: React.ReactNode;
};

// context value
export type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};
