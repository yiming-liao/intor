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
  type GenLocale,
  type GenMessages,
  type GenReplacements,
  type GenRich,
  type RuntimeFetch,
  type TranslatorInstance,
} from "@/core";
import { initTranslator } from "../translator";

export interface GetTranslatorParams<CK extends GenConfigKeys = "__default__"> {
  locale: GenLocale<CK> | (string & {});
  fetch?: RuntimeFetch;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
}

/**
 * Get a edge-runtime translator for the current execution context.
 */
export async function getTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = GenReplacements<CK>,
  RichSchema = GenRich<CK>,
  PK extends LocalizedPreKey<GenMessages<CK>> | undefined = undefined,
>(
  config: IntorResolvedConfig,
  params: GetTranslatorParams<CK> & { preKey?: PK },
): Promise<
  TranslatorInstance<GenMessages<CK>, ReplacementSchema, RichSchema, PK>
> {
  const { locale, fetch, preKey, handlers, plugins } = params;

  // Initialize a locale-bound translator snapshot with messages loaded
  const translator = await initTranslator(config, locale, {
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
  } as TranslatorInstance<GenMessages<CK>, ReplacementSchema, RichSchema, PK>;
}
