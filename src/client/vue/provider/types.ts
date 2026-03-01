import type { IntorConfig } from "../../../config";
import type {
  LocaleMessages,
  Translator,
  TranslateHook,
  TranslateHandlers,
} from "intor-translator";
import type { ComputedRef, Ref } from "vue";

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
  locale: string;
  messages?: Ref<LocaleMessages>;
  isLoading?: Ref<boolean>;
  onLocaleChange?: (newLocale: string) => Promise<void> | void;
  handlers?: TranslateHandlers;
  hooks?: TranslateHook[];
}

/**
 * Props for `IntorProvider`.
 *
 * @public
 */
export interface IntorProviderProps {
  value: IntorValue;
}

/**
 * Internal Vue context shape.
 * Not part of the public API surface.
 */
export type IntorContextValue = {
  config: IntorConfig;
  locale: Ref<string>;
  setLocale: (locale: string) => void;
  translator: ComputedRef<Translator<LocaleMessages>>;
};
