import { Locale } from "intor-translator";
import * as React from "react";

// Context value
export type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

// Provider props
export type LocaleProviderProps = {
  value: { initialLocale: Locale };
  children: React.ReactNode;
};
