import type { TranslatorInstanceServer } from "../translator/translator-instance";
import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenLocale, GenMessages } from "@/core";
import type { MessagesReadOptions } from "@/core";
import type {
  LocalizedNodeKeys,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import { createIntorRuntime } from "../runtime";

export interface GetTranslatorParams {
  config: IntorResolvedConfig;
  locale: string;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
  readOptions?: MessagesReadOptions;
}

/**
 * Create a server-side translator for the current execution context.
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
export async function getTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(params: GetTranslatorParams & { preKey?: PK }) {
  const { config, readOptions, preKey, handlers, plugins } = params;
  const locale = params.locale as GenLocale<CK>;

  // Create runtime (request-scoped, no cache write)
  const runtime = createIntorRuntime<CK>(config, {
    readOptions,
    allowCacheWrite: false,
  });

  // Ensure messages & create translator snapshot
  await runtime.ensureMessages(locale);
  const translator = runtime.translator(locale, {
    plugins,
    handlers,
    preKey,
  });

  return {
    messages: translator.messages,
    locale,
    hasKey: translator.hasKey,
    t: translator.t,
  };
}
