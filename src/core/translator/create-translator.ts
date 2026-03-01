import type { IntorResolvedConfig } from "../../config";
import type {
  Locale,
  LocaleMessages,
  TranslateHandlers,
  TranslateHook,
} from "intor-translator";
import { Translator } from "intor-translator";
import { mergeMessages } from "../../core/messages/merge-messages";

export interface CreateTranslatorParams {
  config: IntorResolvedConfig;
  locale: Locale;
  messages: LocaleMessages;
  handlers?: TranslateHandlers;
  hooks?: TranslateHook[];
}

/**
 * Create a server-side Translator instance for a fixed locale.
 *
 * - Merges static config messages with runtime-loaded messages
 * - Initializes a Translator bound to a specific locale
 * - Injects fallback rules, handlers, and hooks from config
 */
export function createTranslator(
  params: CreateTranslatorParams,
): Translator<LocaleMessages> {
  const { config, locale, messages, handlers, hooks } = params;

  // Merge static config messages with runtime-loaded messages
  const finalMessages = mergeMessages(config.messages, messages, {
    config,
    locale,
  });

  const { loadingMessage, missingMessage } = config.translator ?? {};

  const translator = new Translator<LocaleMessages>({
    locale,
    messages: finalMessages,
    fallbackLocales: config.fallbackLocales,
    ...(loadingMessage !== undefined ? { loadingMessage } : {}),
    ...(missingMessage !== undefined ? { missingMessage } : {}),
    ...(handlers !== undefined ? { handlers } : {}),
    ...(hooks !== undefined ? { hooks } : {}),
  });

  return translator;
}
