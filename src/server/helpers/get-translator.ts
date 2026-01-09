import type { TranslatorInstanceServer } from "../translator/translator-instance";
import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenMessages, MessagesReaders } from "@/core";
import type {
  LocalizedPreKey,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import { createIntorRuntime } from "../runtime";

export interface GetTranslatorParams {
  locale: string;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
  readers?: MessagesReaders;
  allowCacheWrite?: boolean;
}

/**
 * Get a server-side translator for the current execution context.
 */

// Signature: Without preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = unknown,
>(
  config: IntorResolvedConfig,
  params: GetTranslatorParams,
): Promise<TranslatorInstanceServer<GenMessages<CK>, ReplacementSchema>>;

// Signature: With preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = unknown,
  PK extends string = LocalizedPreKey<GenMessages<CK>>,
>(
  config: IntorResolvedConfig,
  params: Omit<GetTranslatorParams, "preKey"> & { preKey?: PK },
): Promise<TranslatorInstanceServer<GenMessages<CK>, ReplacementSchema, PK>>;

// Implementation
export async function getTranslator(
  config: IntorResolvedConfig,
  params: GetTranslatorParams & { preKey?: string },
) {
  const { readers, allowCacheWrite, preKey, handlers, plugins } = params;
  const locale = params.locale;

  // Create runtime (request-scoped, no cache write)
  const runtime = createIntorRuntime(config, {
    readers,
    allowCacheWrite,
  });

  // Ensure messages & create translator snapshot
  await runtime.ensureMessages(locale);
  const translator = runtime.translator(locale, {
    preKey,
    plugins,
    handlers,
  });

  return {
    messages: translator.messages,
    locale,
    hasKey: translator.hasKey,
    t: translator.t,
  };
}
