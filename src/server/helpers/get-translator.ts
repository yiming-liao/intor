import type { TranslatorInstanceServer } from "../translator/translator-instance";
import type { IntorResolvedConfig } from "@/config";
import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  MessagesReaders,
  RuntimeFetch,
} from "@/core";
import type {
  LocalizedPreKey,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import { initTranslator } from "@/server/translator";

export interface GetTranslatorParams {
  locale: string;
  readers?: MessagesReaders;
  allowCacheWrite?: boolean;
  fetch?: RuntimeFetch;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
}

/**
 * Get a server-side translator for the current execution context.
 */

// Signature: Without preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = GenReplacements<CK>,
>(
  config: IntorResolvedConfig,
  params: GetTranslatorParams,
): Promise<TranslatorInstanceServer<GenMessages<CK>, ReplacementSchema>>;

// Signature: With preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = GenReplacements<CK>,
  PK extends string = LocalizedPreKey<GenMessages<CK>>,
>(
  config: IntorResolvedConfig,
  params: GetTranslatorParams & { preKey?: PK },
): Promise<TranslatorInstanceServer<GenMessages<CK>, ReplacementSchema, PK>>;

// Implementation
export async function getTranslator(
  config: IntorResolvedConfig,
  params: GetTranslatorParams & { preKey?: string },
) {
  const { locale, readers, allowCacheWrite, fetch, preKey, handlers, plugins } =
    params;

  // Initialize a locale-bound translator snapshot with messages loaded
  const translator = await initTranslator(config, locale, {
    readers,
    allowCacheWrite,
    fetch: fetch || globalThis.fetch,
    preKey,
    plugins,
    handlers,
  });

  return {
    messages: translator.messages,
    locale: translator.locale,
    hasKey: translator.hasKey,
    t: translator.t,
  };
}
