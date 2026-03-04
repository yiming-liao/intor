import type { IntorConfig } from "../../config";
import type {
  LocalizedPreKey,
  TranslateHandlers,
  TranslateHook,
} from "intor-translator";
import {
  createTRich,
  type GenConfigKeys,
  type GenMessages,
  type GenReplacements,
  type GenRich,
  type RuntimeFetch,
  type BaseTranslator,
} from "../../core";
import { initTranslator } from "../translator";

/**
 * Input parameters for `getTranslator`.
 *
 * @public
 */
export interface GetTranslatorParams {
  locale: string;
  fetch?: RuntimeFetch;
  handlers?: TranslateHandlers;
  hooks?: TranslateHook[];
}

/**
 * Get a edge-runtime translator for the current execution context.
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
  const { locale, fetch = globalThis.fetch, preKey, handlers, hooks } = params;

  // Initialize a locale-bound translator snapshot with messages loaded
  const translator = await initTranslator(config, locale, {
    fetch,
    ...(handlers !== undefined ? { handlers } : {}),
    ...(hooks !== undefined ? { hooks } : {}),
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
