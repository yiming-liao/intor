import type { IntorConfig } from "../../../config";
import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  GenRich,
  BaseTranslator,
  TranslatorKeyMode,
} from "../../../core";
import type { LocalizedPreKey } from "intor-translator";
import {
  getTranslator as getTranslatorCore,
  type GetTranslatorParams,
} from "intor/server";
import { getLocale } from "./get-locale";

/**
 * Get a server-side translator for the current execution context.
 *
 * - Automatically resolves the locale from the framework context.
 *
 * @public
 */
export async function getTranslator<
  CK extends GenConfigKeys = "__default__",
  KM extends TranslatorKeyMode = "loose",
  PK extends LocalizedPreKey<GenMessages<CK>> | undefined = undefined,
>(
  config: IntorConfig,
  params?: Omit<GetTranslatorParams, "locale"> & { preKey?: PK },
): Promise<
  BaseTranslator<GenMessages<CK>, GenReplacements<CK>, GenRich<CK>, PK, KM>
> {
  const locale = await getLocale(config);

  return getTranslatorCore(config, { locale, ...(params ?? {}) });
}
