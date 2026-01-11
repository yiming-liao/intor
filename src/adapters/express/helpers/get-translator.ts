import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenMessages, GenReplacements } from "@/core";
import type { GetTranslatorParams, TranslatorInstanceServer } from "@/server";
import type { Request } from "express";
import type { LocalizedPreKey } from "intor-translator";
import { getTranslator as getTranslatorCore } from "@/server";

type GetTranslatorExpressParams = Omit<GetTranslatorParams, "locale">;

/**
 * Get a server-side translator for the current execution context.
 *
 * - Automatically resolves the locale from the framework context.
 *
 * @platform Express
 */

// Signature: Without preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = GenReplacements<CK>,
>(
  config: IntorResolvedConfig,
  req: Request,
  params?: GetTranslatorExpressParams,
): Promise<TranslatorInstanceServer<GenMessages<CK>, ReplacementSchema>>;

// Signature: With preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = GenReplacements<CK>,
  PK extends string = LocalizedPreKey<GenMessages<CK>>,
>(
  config: IntorResolvedConfig,
  req: Request,
  params?: GetTranslatorExpressParams & { preKey?: PK },
): Promise<TranslatorInstanceServer<GenMessages<CK>, ReplacementSchema, PK>>;

// Implementation
export async function getTranslator(
  config: IntorResolvedConfig,
  req: Request,
  params?: GetTranslatorExpressParams & { preKey?: string },
) {
  const { preKey, handlers, plugins, readers, allowCacheWrite } = params || {};

  return getTranslatorCore(config, {
    locale: req.intor?.locale || config.defaultLocale,
    preKey,
    handlers,
    plugins,
    readers,
    allowCacheWrite,
    // NOTE:
    // The runtime implementation is intentionally erased.
    // Type safety is guaranteed by public type contracts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
}
