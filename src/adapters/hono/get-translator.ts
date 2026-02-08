import type { IntorResolvedConfig } from "@/config";
import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  GenRich,
  TranslatorInstance,
} from "@/core";
import type { GetTranslatorParams } from "@/edge";
import type { Context } from "hono";
import type { LocalizedPreKey } from "intor-translator";
import { getTranslator as getTranslatorCore } from "@/edge";

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
  ReplacementSchema = GenReplacements<CK>,
  RichSchema = GenRich<CK>,
  PK extends LocalizedPreKey<GenMessages<CK>> | undefined = undefined,
>(
  config: IntorResolvedConfig,
  c: Context,
  params?: GetTranslatorHonoParams<CK> & { preKey?: PK },
): Promise<
  TranslatorInstance<GenMessages<CK>, ReplacementSchema, RichSchema, PK>
> {
  const { preKey, handlers, plugins } = params || {};

  return getTranslatorCore(config, {
    locale: c.get("intor")?.locale || config.defaultLocale,
    preKey,
    handlers,
    plugins,
  });
}
