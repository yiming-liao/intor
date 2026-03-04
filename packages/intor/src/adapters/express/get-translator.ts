import type { IntorConfig } from "../../config";
import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  GenRich,
  BaseTranslator,
} from "../../core";
import type { Request } from "express";
import type { LocalizedPreKey } from "intor-translator";
import {
  getTranslator as getTranslatorCore,
  type GetTranslatorParams,
} from "intor/server";

/**
 * Get a server-side translator for the current execution context.
 *
 * - Automatically resolves the locale from the framework context.
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
  req: Request,
  params?: Omit<GetTranslatorParams, "locale"> & { preKey?: PK },
): Promise<BaseTranslator<GenMessages<CK>, ReplacementShape, RichShape, PK>> {
  const locale = req.intor?.locale ?? config.defaultLocale;

  return getTranslatorCore(config, { locale, ...(params ?? {}) });
}
