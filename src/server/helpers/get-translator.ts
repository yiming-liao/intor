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
  type MessagesReaders,
  type RuntimeFetch,
  type TranslatorInstance,
} from "@/core";
import { initTranslator, type MessagesLoader } from "../translator";

export interface GetTranslatorParams<CK extends GenConfigKeys = "__default__"> {
  locale: GenLocale<CK> | (string & {});
  loader?: MessagesLoader;
  readers?: MessagesReaders;
  allowCacheWrite?: boolean;
  fetch?: RuntimeFetch;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
}

/**
 * Get a server-side translator for the current execution context.
 */
export async function getTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementShape = GenReplacements<CK>,
  RichShape = GenRich<CK>,
  PK extends LocalizedPreKey<GenMessages<CK>> | undefined = undefined,
>(
  config: IntorResolvedConfig,
  params: GetTranslatorParams<CK> & { preKey?: PK },
): Promise<
  TranslatorInstance<GenMessages<CK>, ReplacementShape, RichShape, PK>
> {
  const {
    locale,
    loader,
    readers,
    allowCacheWrite = false,
    fetch,
    handlers,
    plugins,
    preKey,
  } = params;

  // Initialize a locale-bound translator snapshot with messages loaded
  const translator = await initTranslator(config, locale, {
    loader,
    readers,
    allowCacheWrite,
    fetch: fetch || globalThis.fetch,
    handlers,
    plugins,
  });
  const scoped = translator.scoped(preKey);

  return {
    messages: translator.messages,
    locale: translator.locale,
    hasKey: scoped.hasKey,
    t: scoped.t,
    tRich: createTRich(scoped.t),
  } as TranslatorInstance<GenMessages<CK>, ReplacementShape, RichShape, PK>;
}
