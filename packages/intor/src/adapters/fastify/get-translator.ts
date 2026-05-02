import type { IntorConfig } from "../../config";
import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  GenRich,
  BaseTranslator,
  TranslatorKeyMode,
} from "../../core";
import type { FastifyRequest } from "fastify";
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
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  KM extends TranslatorKeyMode = "loose",
>(
  config: IntorConfig,
  request: FastifyRequest,
  params?: Omit<GetTranslatorParams, "locale">,
): Promise<
  BaseTranslator<
    GenMessages<CK>,
    GenReplacements<CK>,
    GenRich<CK>,
    undefined,
    KM
  >
>;

/** @public */
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  KM extends TranslatorKeyMode = "loose",
  PK extends LocalizedPreKey<GenMessages<CK>> = LocalizedPreKey<
    GenMessages<CK>
  >,
>(
  config: IntorConfig,
  request: FastifyRequest,
  params: Omit<GetTranslatorParams, "locale"> & { preKey: PK },
): Promise<
  BaseTranslator<GenMessages<CK>, GenReplacements<CK>, GenRich<CK>, PK, KM>
>;

/** @public */
export async function getTranslator<
  CK extends GenConfigKeys = "__default__",
  KM extends TranslatorKeyMode = "loose",
  PK extends LocalizedPreKey<GenMessages<CK>> | undefined = undefined,
>(
  config: IntorConfig,
  request: FastifyRequest,
  params?: Omit<GetTranslatorParams, "locale"> & { preKey?: PK },
): Promise<
  BaseTranslator<GenMessages<CK>, GenReplacements<CK>, GenRich<CK>, PK, KM>
> {
  const locale = request.intor?.locale ?? config.defaultLocale;

  return getTranslatorCore(config, {
    locale,
    ...(params ?? {}),
  }) as unknown as Promise<
    BaseTranslator<GenMessages<CK>, GenReplacements<CK>, GenRich<CK>, PK, KM>
  >;
}
