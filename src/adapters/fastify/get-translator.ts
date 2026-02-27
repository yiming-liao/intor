import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  GenRich,
  BaseTranslator,
} from "../../core";
import type { GetTranslatorParams } from "../../server";
import type { FastifyRequest } from "fastify";
import type { IntorConfig } from "intor";
import type { LocalizedPreKey } from "intor-translator";
import { getTranslator as getTranslatorCore } from "intor/server";

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
  config: IntorConfig,
  request: FastifyRequest,
  params?: GetTranslatorFastifyParams<CK> & { preKey?: PK },
): Promise<BaseTranslator<GenMessages<CK>, ReplacementShape, RichShape, PK>> {
  const locale = request.intor?.locale || config.defaultLocale;

  if (!params) return getTranslatorCore(config, { locale });
  return getTranslatorCore(config, { locale, ...params });
}
