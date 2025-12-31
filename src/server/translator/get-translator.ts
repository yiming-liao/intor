import type { TranslatorInstanceServer } from "./translator-instance";
import type { IntorResolvedConfig } from "@/config";
import type { MessagesReader, GenConfigKeys, GenMessages } from "@/core";
import type {
  LocaleMessages,
  LocalizedNodeKeys,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import { Translator } from "intor-translator";
import { loadMessages } from "../messages";

export interface GetTranslatorParams {
  config: IntorResolvedConfig;
  locale: string;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
  extraOptions?: { exts?: string[]; messagesReader?: MessagesReader };
}

/**
 * Create a translator instance for server-side usage.
 */

// Signature: Without preKey
export function getTranslator<CK extends GenConfigKeys = "__default__">(
  params: GetTranslatorParams,
): Promise<TranslatorInstanceServer<GenMessages<CK>>>;

// Signature: With preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(
  params: GetTranslatorParams & { preKey?: PK },
): Promise<TranslatorInstanceServer<GenMessages<CK>, PK>>;

// Implementation
export async function getTranslator(
  params: GetTranslatorParams & { preKey?: string },
) {
  const { config, locale, preKey, extraOptions } = params;

  const messages = await loadMessages({ config, locale, extraOptions });

  const translator = new Translator<LocaleMessages>({
    locale,
    messages,
    fallbackLocales: config.fallbackLocales,
    loadingMessage: config.translator?.loadingMessage,
    missingMessage: config.translator?.missingMessage,
    handlers: params.handlers,
    plugins: params.plugins,
  });

  const scoped = translator.scoped(preKey);

  return {
    messages,
    locale,
    hasKey: preKey ? scoped.hasKey : translator.hasKey,
    t: preKey ? scoped.t : translator.t,
    // NOTE:
    // The runtime implementation is intentionally erased.
    // Type safety is guaranteed by public type contracts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}
