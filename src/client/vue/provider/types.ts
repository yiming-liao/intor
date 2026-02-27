import type { IntorConfig } from "../../../config";
import type { Locale, LocaleMessages, Translator } from "intor-translator";
import type {
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import type { ComputedRef, Ref } from "vue";

export interface IntorValue {
  config: IntorConfig;
  locale: Locale;
  messages?: Ref<LocaleMessages>;
  isLoading?: Ref<boolean>;
  onLocaleChange?: (newLocale: Locale) => Promise<void> | void;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
}

export interface IntorProviderProps {
  value: IntorValue;
}

export type IntorContextValue = {
  config: IntorConfig;
  locale: Ref<string>;
  setLocale: (locale: Locale) => void;
  translator: ComputedRef<Translator<LocaleMessages>>;
};
