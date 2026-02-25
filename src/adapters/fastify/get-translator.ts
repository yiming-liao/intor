import type { IntorResolvedConfig } from "@/config";
import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  GenRich,
  TranslatorInstance,
} from "@/core";
import type { GetTranslatorParams } from "@/server";
import type { FastifyRequest } from "fastify";
import type { LocalizedPreKey } from "intor-translator";
import { getTranslator as getTranslatorCore } from "@/server";

type GetTranslatorFastifyParams<CK extends GenConfigKeys = "__default__"> =
  Omit<GetTranslatorParams<CK>, "locale">;

/**
 * Get a server-side translator for the current execution context.
 *
 * - Automatically resolves the locale from the framework context.
 *
 * @platform Fastify
 */
export async function getTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementShape = GenReplacements<CK>,
  RichShape = GenRich<CK>,
  PK extends LocalizedPreKey<GenMessages<CK>> | undefined = undefined,
>(
  config: IntorResolvedConfig,
  request: FastifyRequest,
  params?: GetTranslatorFastifyParams<CK> & { preKey?: PK },
): Promise<
  TranslatorInstance<GenMessages<CK>, ReplacementShape, RichShape, PK>
> {
  const { loader, readers, allowCacheWrite, handlers, plugins, preKey } =
    params || {};

  return getTranslatorCore(config, {
    locale: request.intor?.locale || config.defaultLocale,
    loader,
    readers,
    allowCacheWrite,
    handlers,
    plugins,
    preKey,
  });
}
