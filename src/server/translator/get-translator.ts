import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type {
  GenConfigKeys,
  GenLocale,
  GenMessages,
} from "@/shared/types/generated.types";
import type {
  TranslatorInstance,
  TranslatorBaseProps,
} from "@/shared/types/translator-instance.types";
import type { LocalizedNodeKeys, TranslateHandlers } from "intor-translator";
import { Translator } from "intor-translator";
import { loadMessages, type MessagesReader } from "@/server/messages";

/**
 * Create a translator instance for a specific locale and pathname
 *
 * - Loads messages using the provided config, locale, and pathname.
 * - Initializes a translator with `t`, `hasKey`, and optional scoped methods.
 * - Supports optional `preKey` to create a scoped translator for nested keys.
 */

// Signature: Without preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
>(options: {
  config: IntorResolvedConfig;
  locale: GenLocale;
  pathname?: string;
  handlers?: TranslateHandlers;
  extraOptions?: { exts?: string[]; messagesReader?: MessagesReader };
}): Promise<TranslatorInstance<GenMessages<CK>>>;

// Signature: With preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(options: {
  config: IntorResolvedConfig;
  locale: GenLocale;
  pathname?: string;
  handlers?: TranslateHandlers;
  extraOptions?: { exts?: string[]; messagesReader?: MessagesReader };
  preKey?: PK;
}): Promise<TranslatorInstance<GenMessages<CK>, PK>>;

// Implementation
export async function getTranslator(options: {
  config: IntorResolvedConfig;
  locale: string;
  pathname?: string;
  handlers?: TranslateHandlers;
  extraOptions?: { exts?: string[]; messagesReader?: MessagesReader };
  preKey?: string;
}) {
  const { config, locale, pathname = "", preKey } = options;
  const messages = await loadMessages({
    config,
    locale,
    pathname,
    extraOptions: options.extraOptions,
  });

  // Create a Translator instance
  const translator = new Translator<unknown>({
    locale,
    messages,
    fallbackLocales: config.fallbackLocales,
    loadingMessage: config.translator?.loadingMessage,
    placeholder: config.translator?.placeholder,
    handlers: options.handlers,
  });

  const props: TranslatorBaseProps = { messages, locale };

  const scoped = translator.scoped(preKey);
  return {
    ...props,
    hasKey: preKey ? scoped.hasKey : translator.hasKey,
    t: preKey ? scoped.t : translator.t,
  };
}
