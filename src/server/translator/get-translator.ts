import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type {
  GenConfigKeys,
  GenLocale,
  GenMessages,
} from "@/shared/types/generated";
import type { TranslatorInstance } from "@/shared/types/translator-instance";
import type {
  LocaleMessages,
  LocalizedNodeKeys,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import { Translator } from "intor-translator";
import { loadMessages, type MessagesReader } from "@/server/messages";

/**
 * Create a translator instance for a specific locale.
 */

// Signature: Without preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
>(options: {
  config: IntorResolvedConfig;
  locale: GenLocale<CK>;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
  extraOptions?: { exts?: string[]; messagesReader?: MessagesReader };
}): Promise<TranslatorInstance<GenMessages<CK>>>;

// Signature: With preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(options: {
  config: IntorResolvedConfig;
  locale: GenLocale<CK>;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
  extraOptions?: { exts?: string[]; messagesReader?: MessagesReader };
  preKey?: PK;
}): Promise<TranslatorInstance<GenMessages<CK>, PK>>;

// Implementation
export async function getTranslator(options: {
  config: IntorResolvedConfig;
  locale: string;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
  extraOptions?: { exts?: string[]; messagesReader?: MessagesReader };
  preKey?: string;
}) {
  const { config, locale, preKey } = options;
  const messages = await loadMessages({
    config,
    locale,
    extraOptions: options.extraOptions,
  });

  // Create a Translator instance
  const translator = new Translator<LocaleMessages>({
    locale,
    messages,
    fallbackLocales: config.fallbackLocales,
    loadingMessage: config.translator?.loadingMessage,
    placeholder: config.translator?.placeholder,
    handlers: options.handlers,
    plugins: options.plugins,
  });

  const props = { messages, locale };

  const scoped = translator.scoped(preKey);
  return {
    ...props,
    hasKey: preKey ? scoped.hasKey : translator.hasKey,
    t: preKey ? scoped.t : translator.t,
    // NOTE:
    // Return type is fully validated by overload signatures.
    // Assertion here is intentional due to TS inference limitations.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}
