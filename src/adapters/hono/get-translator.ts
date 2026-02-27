import type { IntorConfig } from "../../config";
import type {
  TypedConfigKeys,
  TypedMessages,
  TypedReplacements,
  TypedRich,
  BaseTranslator,
} from "../../core";
import type {} from "../../edge";
import type { Context } from "hono";
import type { LocalizedPreKey } from "intor-translator";
import {
  getTranslator as getTranslatorCore,
  type GetTranslatorParams,
} from "intor/edge";

/**
 * Get a edge-runtime translator for the current execution context.
 *
 * - Automatically resolves the locale from the framework context.
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
  c: Context,
  params?: Omit<GetTranslatorParams, "locale"> & { preKey?: PK },
): Promise<BaseTranslator<TypedMessages<CK>, ReplacementShape, RichShape, PK>> {
  const locale = c.get("intor")?.locale ?? config.defaultLocale;

  return getTranslatorCore(config, { locale, ...(params ?? {}) });
}
