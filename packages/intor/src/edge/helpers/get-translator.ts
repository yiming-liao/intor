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
  type TranslatorKeyMode,
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
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  KM extends TranslatorKeyMode = "loose",
>(
  config: IntorConfig,
  params: GetTranslatorParams,
): Promise<
  BaseTranslator<
    GenMessages<CK>,
    GenReplacements<CK>,
    GenRich<CK>,
    undefined,
    KM
  >
>;

/** @public */
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  KM extends TranslatorKeyMode = "loose",
  PK extends LocalizedPreKey<GenMessages<CK>> = LocalizedPreKey<
    GenMessages<CK>
  >,
>(
  config: IntorConfig,
  params: GetTranslatorParams & { preKey: PK },
): Promise<
  BaseTranslator<GenMessages<CK>, GenReplacements<CK>, GenRich<CK>, PK, KM>
>;

/** @public */
export async function getTranslator<
  CK extends GenConfigKeys = "__default__",
  KM extends TranslatorKeyMode = "loose",
  PK extends LocalizedPreKey<GenMessages<CK>> | undefined = undefined,
>(
  config: IntorConfig,
  params: GetTranslatorParams & { preKey?: PK },
): Promise<
  BaseTranslator<GenMessages<CK>, GenReplacements<CK>, GenRich<CK>, PK, KM>
> {
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
  } as BaseTranslator<
    GenMessages<CK>,
    GenReplacements<CK>,
    GenRich<CK>,
    PK,
    KM
  >;
}
