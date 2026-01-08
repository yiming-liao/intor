import type { IntorResolvedConfig } from "@/config";
import type {
  LocaleMessages,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import { Translator } from "intor-translator";
import { mergeMessages } from "@/core/messages/merge-messages";

interface CreateTranslatorParams {
  config: IntorResolvedConfig;
  locale: string;
  messages: LocaleMessages;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
}

/**
 * Create a server-side translator snapshot.
 *
 * - Merges static config messages with runtime-loaded messages
 * - Creates a Translator instance for a fixed locale
 * - Optionally scopes the translator with a preKey
 *
 * The returned object is a read-only translation view
 * and does not expose the underlying Translator instance.
 */
export function createTranslator(
  params: CreateTranslatorParams & { preKey?: string },
) {
  const { config, locale, messages, preKey, handlers, plugins } = params;

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

  // Apply scoped view when preKey is provided
  const scoped = preKey ? translator.scoped(preKey) : null;

  return {
    messages: finalMessages,
    locale,
    hasKey: scoped ? scoped.hasKey : translator.hasKey,
    t: scoped ? scoped.t : translator.t,
  };
}
