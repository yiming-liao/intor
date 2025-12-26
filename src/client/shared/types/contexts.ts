import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenLocale } from "@/shared/types";
import type {
  Locale,
  LocaleMessages,
  TranslateHandlers,
  TranslateHook,
  Translator,
  TranslatorPlugin,
} from "intor-translator";

/**
 * Shared client-side runtime types for Intor.
 *
 * These types define:
 * - The initial value passed into `IntorProvider`
 * - The value shape of each internal runtime context (config, locale, messages, etc.)
 *
 * They are framework-agnostic and shared across different client implementations.
 */

/** Initial value used to bootstrap the client-side Intor runtime. */
export interface IntorInitialValue<CK extends GenConfigKeys = "__default__"> {
  config: IntorResolvedConfig;
  initialLocale: GenLocale<CK>;
  initialMessages?: Readonly<LocaleMessages>;
  onLocaleChange?: (newLocale: string) => Promise<void> | void;
  isLoading?: boolean;
}

// config
export type ConfigContextValue = {
  config: IntorResolvedConfig;
};

// locale
export type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

// message
export type MessagesContextValue = {
  messages: Readonly<LocaleMessages>;
  isLoading: boolean;
};

// translator
export type TranslatorContextValue = {
  translator: Translator<unknown>;
};

// translator runtime
export type TranslatorRuntimeContextValue = {
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
};
