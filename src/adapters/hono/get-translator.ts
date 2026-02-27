import type { IntorConfig } from "../../config";
import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  GenRich,
  BaseTranslator,
} from "../../core";
import type { GetTranslatorParams } from "../../edge";
import type { Context } from "hono";
import type { LocalizedPreKey } from "intor-translator";
import { getTranslator as getTranslatorCore } from "intor/edge";

type GetTranslatorHonoParams<CK extends GenConfigKeys = "__default__"> = Omit<
  GetTranslatorParams<CK>,
  "locale"
>;

/**
 * Get a edge-runtime translator for the current execution context.
 *
 * - Automatically resolves the locale from the framework context.
 *
 * @platform Hono
 */
export async function getTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementShape = GenReplacements<CK>,
  RichShape = GenRich<CK>,
  PK extends LocalizedPreKey<GenMessages<CK>> | undefined = undefined,
>(
  config: IntorConfig,
  c: Context,
  params?: GetTranslatorHonoParams<CK> & { preKey?: PK },
): Promise<BaseTranslator<GenMessages<CK>, ReplacementShape, RichShape, PK>> {
  const locale = c.get("intor")?.locale || config.defaultLocale;

  if (!params) return getTranslatorCore(config, { locale });
  return getTranslatorCore(config, { locale, ...params });
}
