import type { TranslatorInstanceServer } from "../translator";
import type {
  GenConfigKeys,
  GenLocale,
  GenMessages,
  MessagesReaders,
} from "@/core";
import type {
  LocalizedNodeKeys,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";

export interface IntorRuntimeOptions {
  readers?: MessagesReaders;
  allowCacheWrite?: boolean;
}

export interface IntorRuntime<CK extends GenConfigKeys = "__default__"> {
  /**
   * Ensure locale messages are loaded and ready for use.
   */
  ensureMessages(locale: GenLocale<CK>): Promise<void>;

  /**
   * Create a translator snapshot using the ensured locale messages.
   */
  // Signature: Without preKey
  translator(locale: GenLocale<CK>): TranslatorInstanceServer<GenMessages<CK>>;
  // Signature: With preKey
  translator<PK extends string = LocalizedNodeKeys<GenMessages<CK>>>(
    locale: GenLocale<CK>,
    options?: {
      preKey: PK;
      handlers?: TranslateHandlers;
      plugins?: (TranslatorPlugin | TranslateHook)[];
    },
  ): TranslatorInstanceServer<GenMessages<CK>, PK>;
  // Implementation
  translator(
    locale: GenLocale<CK>,
    options?: {
      preKey?: string;
      handlers?: TranslateHandlers;
      plugins?: (TranslatorPlugin | TranslateHook)[];
    },
  ): TranslatorInstanceServer<GenMessages<CK>>;
}
