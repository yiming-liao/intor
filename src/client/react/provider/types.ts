import type { IntorConfig } from "../../../config";
import type {
  Locale,
  LocaleMessages,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import type { Translator } from "intor-translator";
import type * as React from "react";

/**
 * Runtime state contract consumed by `IntorProvider`.
 *
 * Represents the locale-bound translation state,
 * including loaded messages and optional runtime extensions.
 *
 * @public
 */
export interface IntorValue {
  config: IntorConfig;
  locale: Locale;
  messages?: Readonly<LocaleMessages>;
  isLoading?: boolean;
  onLocaleChange?: (newLocale: Locale) => Promise<void> | void;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
}

/**
 * Props for `IntorProvider`.
 *
 * @public
 */
export interface IntorProviderProps {
  value: IntorValue;
  children: React.ReactNode;
}

/**
 * Internal React context shape.
 * Not part of the public API surface.
 */
export type IntorContextValue = {
  config: IntorConfig;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  translator: Translator<LocaleMessages>;
};
