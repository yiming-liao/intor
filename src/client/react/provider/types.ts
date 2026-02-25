import type { IntorResolvedConfig } from "@/config";
import type {
  Locale,
  LocaleMessages,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import type { Translator } from "intor-translator";
import type * as React from "react";

export interface IntorValue {
  config: IntorResolvedConfig;
  locale: Locale;
  messages?: Readonly<LocaleMessages>;
  isLoading?: boolean;
  onLocaleChange?: (newLocale: Locale) => Promise<void> | void;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
}

export interface IntorProviderProps {
  value: IntorValue;
  children: React.ReactNode;
}

export type IntorContextValue = {
  config: IntorResolvedConfig;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  translator: Translator<LocaleMessages>;
};
