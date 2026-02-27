import type { IntorConfig } from "../../../config";
import type {
  LocaleMessages,
  Translator,
  TranslateHook,
  TranslateHandlers,
  TranslatorPlugin,
} from "intor-translator";
import type { Readable, Writable } from "svelte/store";

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
  messages?: Readonly<LocaleMessages>;
  isLoading?: boolean;
  onLocaleChange?: (newLocale: string) => Promise<void> | void;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: () => any;
}

/**
 * Internal Svelte context shape.
 * Not part of the public API surface.
 */
export interface IntorContextValue {
  config: IntorConfig;
  locale: Writable<string>;
  setLocale: (locale: string) => void;
  translator: Readable<Translator<LocaleMessages>>;
}
