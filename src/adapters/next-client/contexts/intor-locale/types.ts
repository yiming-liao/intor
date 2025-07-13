import { Locale } from "intor-translator";
import * as React from "react";

// Context value
export type IntorLocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

// Provider props
export type IntorLocaleProviderProps = {
  value: { initialLocale: Locale };
  children: React.ReactNode;
};
