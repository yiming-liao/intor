import type { RuntimeState } from "../helpers/use-runtime-state";
import type { IntorResolvedConfig } from "@/config";
import type { Locale, LocaleMessages, Translator } from "intor-translator";
import type {
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";

export interface IntorProviderProps {
  config?: IntorResolvedConfig;
  locale?: Locale;
  messages?: Readonly<LocaleMessages>;
  isLoading?: boolean;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
  onLocaleChange?: (newLocale: Locale) => Promise<void> | void;
  runtimeState?: RuntimeState;
}

export type IntorContextValue = {
  config: IntorResolvedConfig;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Readonly<LocaleMessages>;
  isLoading: boolean;
  translator: Translator<unknown>;
};
