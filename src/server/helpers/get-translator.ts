import type { TranslatorInstanceServer } from "../translator/translator-instance";
import type { IntorResolvedConfig } from "@/config";
import type {
  LocalizedPreKey,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import {
  createTRich,
  type GenConfigKeys,
  type GenMessages,
  type GenReplacements,
  type GenRich,
  type MessagesReaders,
  type RuntimeFetch,
} from "@/core";
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
  RichSchema = GenRich<CK>,
>(
  config: IntorResolvedConfig,
  params: GetTranslatorParams,
): Promise<
  TranslatorInstanceServer<
    GenMessages<CK>,
    ReplacementSchema,
    RichSchema,
    undefined
  >
>;

// Signature: With preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = GenReplacements<CK>,
  RichSchema = GenRich<CK>,
  PK extends string = LocalizedPreKey<GenMessages<CK>>,
>(
  config: IntorResolvedConfig,
  params: GetTranslatorParams & { preKey?: PK },
): Promise<
  TranslatorInstanceServer<GenMessages<CK>, ReplacementSchema, RichSchema, PK>
>;

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
    plugins,
    handlers,
  });
  const scoped = translator.scoped(preKey);

  return {
    messages: translator.messages,
    locale: translator.locale,
    hasKey: scoped.hasKey,
    t: scoped.t,
    tRich: createTRich(scoped.t),
    // NOTE:
    // The runtime implementation is intentionally erased.
    // Type safety is guaranteed by public type contracts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}
