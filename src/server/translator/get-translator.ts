import type { TranslatorInstanceServer } from "./translator-instance";
import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type {
  GenConfigKeys,
  GenLocale,
  GenMessages,
} from "@/shared/types/generated";
import type {
  LocaleMessages,
  LocalizedNodeKeys,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import { Translator } from "intor-translator";
import { loadMessages, type MessagesReader } from "@/server/messages";

export interface GetTranslatorParams<CK extends GenConfigKeys = "__default__"> {
  config: IntorResolvedConfig;
  locale: GenLocale<CK>;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
  extraOptions?: { exts?: string[]; messagesReader?: MessagesReader };
}

/**
 * Create a translator instance for server-side usage.
 */

// Signature: Without preKey
export function getTranslator<CK extends GenConfigKeys = "__default__">(
  params: GetTranslatorParams<CK>,
): Promise<TranslatorInstanceServer<GenMessages<CK>>>;

// Signature: With preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(
  params: GetTranslatorParams<CK> & { preKey?: PK },
): Promise<TranslatorInstanceServer<GenMessages<CK>, PK>>;

// Implementation
export async function getTranslator<CK extends GenConfigKeys = "__default__">(
  params: GetTranslatorParams<CK> & { preKey?: string },
) {
  const { config, locale, preKey } = params;

  const messages = await loadMessages({
    config,
    locale,
    extraOptions: params.extraOptions,
  });

  // Create a Translator instance
  const translator = new Translator<LocaleMessages>({
    locale,
    messages,
    fallbackLocales: config.fallbackLocales,
    loadingMessage: config.translator?.loadingMessage,
    placeholder: config.translator?.placeholder,
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
