import type { IntorResolvedConfig } from "../../../config";
import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  GenRich,
  BaseTranslator,
} from "../../../core";
import type { GetTranslatorParams } from "../../../server";
import type { LocalizedPreKey } from "intor-translator";
import { getTranslator as getTranslatorCore } from "intor/server";
import { getLocale } from "./get-locale";

type GetTranslatorNextParams<CK extends GenConfigKeys = "__default__"> = Omit<
  GetTranslatorParams<CK>,
  "locale"
>;

/**
 * Get a server-side translator for the current execution context.
 *
 * - Automatically resolves the locale from the framework context.
 *
 * @platform Next.js
 */
export async function getTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementShape = GenReplacements<CK>,
  RichShape = GenRich<CK>,
  PK extends LocalizedPreKey<GenMessages<CK>> | undefined = undefined,
>(
  config: IntorResolvedConfig,
  params?: GetTranslatorNextParams<CK> & { preKey?: PK },
): Promise<BaseTranslator<GenMessages<CK>, ReplacementShape, RichShape, PK>> {
  const locale = await getLocale(config);

  if (!params) return getTranslatorCore(config, { locale });
  return getTranslatorCore(config, { locale, ...params });
}
