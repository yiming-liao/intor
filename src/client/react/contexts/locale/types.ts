import type { Locale } from "intor-translator";
import type * as React from "react";

// context value
export type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

// provider props
export type LocaleProviderProps = {
  value: { initialLocale: string };
  children: React.ReactNode;
};
