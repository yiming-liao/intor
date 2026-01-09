import type { TranslatorInstanceServer } from "../translator";
import type { MessagesReaders } from "@/core";
import type {
  Locale,
  LocaleMessages,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";

export interface IntorRuntimeOptions {
  readers?: MessagesReaders;
  allowCacheWrite?: boolean;
}

export interface IntorRuntime {
  /**
   * Ensure locale messages are loaded and ready for use.
   */
  ensureMessages(locale: Locale): Promise<void>;

  /**
   * Create a translator snapshot using the ensured locale messages.
   */
  translator(
    locale: Locale,
    options?: {
      preKey?: string;
      handlers?: TranslateHandlers;
      plugins?: (TranslatorPlugin | TranslateHook)[];
    },
  ): TranslatorInstanceServer<LocaleMessages>;
}
