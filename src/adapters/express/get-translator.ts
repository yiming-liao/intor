import type { IntorResolvedConfig } from "@/config";
import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  GenRich,
  TranslatorInstance,
} from "@/core";
import type { GetTranslatorParams } from "@/server";
import type { Request } from "express";
import type { LocalizedPreKey } from "intor-translator";
import { getTranslator as getTranslatorCore } from "@/server";

type GetTranslatorExpressParams<CK extends GenConfigKeys = "__default__"> =
  Omit<GetTranslatorParams<CK>, "locale">;

/**
 * Get a server-side translator for the current execution context.
 *
 * - Automatically resolves the locale from the framework context.
 *
 * @platform Express
 */
export async function getTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = GenReplacements<CK>,
  RichSchema = GenRich<CK>,
  PK extends LocalizedPreKey<GenMessages<CK>> | undefined = undefined,
>(
  config: IntorResolvedConfig,
  req: Request,
  params?: GetTranslatorExpressParams<CK> & { preKey?: PK },
): Promise<
  TranslatorInstance<GenMessages<CK>, ReplacementSchema, RichSchema, PK>
> {
  const { loader, readers, allowCacheWrite, handlers, plugins, preKey } =
    params || {};

  return getTranslatorCore(config, {
    locale: req.intor?.locale || config.defaultLocale,
    loader,
    readers,
    allowCacheWrite,
    handlers,
    plugins,
    preKey,
  });
}
