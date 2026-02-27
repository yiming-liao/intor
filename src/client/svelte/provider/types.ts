import type { IntorConfig } from "intor";
import type {
  Locale,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
  Translator,
  LocaleMessages,
} from "intor-translator";
import type { Readable, Writable } from "svelte/store";

export interface IntorValue {
  config: IntorConfig;
  locale: Locale;
  messages?: Readonly<LocaleMessages>;
  isLoading?: boolean;
  onLocaleChange?: (newLocale: Locale) => Promise<void> | void;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
}

export interface IntorProviderProps {
  value: IntorValue;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: () => any;
}

export interface IntorContextValue {
  config: IntorConfig;
  locale: Writable<Locale>;
  setLocale: (locale: Locale) => void;
  translator: Readable<Translator<LocaleMessages>>;
}
