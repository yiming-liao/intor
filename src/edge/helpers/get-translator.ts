import type { IntorConfig } from "../../config";
import type {
  LocalizedPreKey,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import {
  createTRich,
  type TypedConfigKeys,
  type TypedMessages,
  type TypedReplacements,
  type TypedRich,
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
  plugins?: (TranslatorPlugin | TranslateHook)[];
}

/**
 * Get a edge-runtime translator for the current execution context.
 *
 * @public
 */
export async function getTranslator<
  CK extends TypedConfigKeys = "__default__",
  ReplacementShape = TypedReplacements<CK>,
  RichShape = TypedRich<CK>,
  PK extends LocalizedPreKey<TypedMessages<CK>> | undefined = undefined,
>(
  config: IntorConfig,
  params: GetTranslatorParams & { preKey?: PK },
): Promise<BaseTranslator<TypedMessages<CK>, ReplacementShape, RichShape, PK>> {
  const {
    locale,
    fetch = globalThis.fetch,
    preKey,
    handlers,
    plugins,
  } = params;

  // Initialize a locale-bound translator snapshot with messages loaded
  const translator = await initTranslator(config, locale, {
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
  } as BaseTranslator<TypedMessages<CK>, ReplacementShape, RichShape, PK>;
}
