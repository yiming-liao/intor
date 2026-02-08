import type { IntorResolvedConfig } from "@/config";
import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  GenRich,
} from "@/core";
import type { GetTranslatorParams, TranslatorInstanceServer } from "@/server";
import type { FastifyRequest } from "fastify";
import type { LocalizedPreKey } from "intor-translator";
import { getTranslator as getTranslatorCore } from "@/server";

type GetTranslatorFastifyParams = Omit<GetTranslatorParams, "locale">;

/**
 * Get a server-side translator for the current execution context.
 *
 * - Automatically resolves the locale from the framework context.
 *
 * @platform Fastify
 */

// Signature: Without preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = GenReplacements<CK>,
  RichSchema = GenRich<CK>,
>(
  config: IntorResolvedConfig,
  request: FastifyRequest,
  params?: GetTranslatorFastifyParams,
): Promise<
  TranslatorInstanceServer<
    GenMessages<CK>,
    ReplacementSchema,
    RichSchema,
    undefined
  >
>;

// Signature: With preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = GenReplacements<CK>,
  RichSchema = GenRich<CK>,
  PK extends string = LocalizedPreKey<GenMessages<CK>>,
>(
  config: IntorResolvedConfig,
  request: FastifyRequest,
  params?: GetTranslatorFastifyParams & { preKey?: PK },
): Promise<
  TranslatorInstanceServer<GenMessages<CK>, ReplacementSchema, RichSchema, PK>
>;

// Implementation
export async function getTranslator(
  config: IntorResolvedConfig,
  request: FastifyRequest,
  params?: GetTranslatorFastifyParams & { preKey?: string },
) {
  const { preKey, handlers, plugins, readers, allowCacheWrite } = params || {};

  return getTranslatorCore(config, {
    locale: request.intor?.locale || config.defaultLocale,
    preKey,
    handlers,
    plugins,
    readers,
    allowCacheWrite,
  });
}
