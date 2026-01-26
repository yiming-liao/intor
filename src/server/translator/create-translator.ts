import type { IntorResolvedConfig } from "@/config";
import type {
  LocaleMessages,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import { Translator } from "intor-translator";
import { mergeMessages } from "@/core/messages/merge-messages";

export interface CreateTranslatorParams {
  config: IntorResolvedConfig;
  locale: string;
  messages: LocaleMessages;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
}

/**
 * Create a server-side Translator instance for a fixed locale.
 *
 * - Merges static config messages with runtime-loaded messages
 * - Initializes a Translator bound to a specific locale
 * - Injects fallback rules, handlers, and plugins from config
 */
export function createTranslator(
  params: CreateTranslatorParams,
): Translator<unknown> {
  const { config, locale, messages, handlers, plugins } = params;

  // Merge static config messages with runtime-loaded messages
  const finalMessages = mergeMessages(config.messages, messages, {
    config,
    locale,
  });

  const translator = new Translator<unknown>({
    locale,
    messages: finalMessages,
    fallbackLocales: config.fallbackLocales,
    loadingMessage: config.translator?.loadingMessage,
    missingMessage: config.translator?.missingMessage,
    handlers,
    plugins,
  });

  return translator;
}
