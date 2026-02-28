import type { IntorConfig } from "../../config";
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
  type BaseTranslator,
  type MessagesLoader,
} from "../../core";
import { initTranslator } from "../translator";

/**
 * Input parameters for `getTranslator`.
 *
 * @public
 */
export interface GetTranslatorParams {
  locale: string;
  loader?: MessagesLoader;
  readers?: MessagesReaders;
  allowCacheWrite?: boolean;
  fetch?: RuntimeFetch;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
}

/**
 * Get a server-side translator for the current execution context.
 *
 * @public
 */
export async function getTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementShape = GenReplacements<CK>,
  RichShape = GenRich<CK>,
  PK extends LocalizedPreKey<GenMessages<CK>> | undefined = undefined,
>(
  config: IntorConfig,
  params: GetTranslatorParams & { preKey?: PK },
): Promise<BaseTranslator<GenMessages<CK>, ReplacementShape, RichShape, PK>> {
  const {
    locale,
    loader,
    readers,
    allowCacheWrite = false,
    fetch = globalThis.fetch,
    handlers,
    plugins,
    preKey,
  } = params;

  // Initialize a locale-bound translator snapshot with messages loaded
  const translator = await initTranslator(config, locale, {
    ...(loader !== undefined ? { loader } : {}),
    ...(readers !== undefined ? { readers } : {}),
    allowCacheWrite,
    fetch,
    ...(handlers !== undefined ? { handlers } : {}),
    ...(plugins !== undefined ? { plugins } : {}),
  });
  const scoped = translator.scoped(preKey);

  return {
    messages: translator.messages,
    locale: translator.locale,
    hasKey: scoped.hasKey,
    t: scoped.t,
    tRich: createTRich(scoped.t),
  } as BaseTranslator<GenMessages<CK>, ReplacementShape, RichShape, PK>;
}
