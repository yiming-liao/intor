import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenMessages } from "@/core";
import type { GetTranslatorParams, TranslatorInstanceServer } from "@/server";
import type { Request } from "express";
import type { LocalizedNodeKeys } from "intor-translator";
import { getTranslator as getTranslatorCore } from "@/server";

type GetTranslatorExpressParams = Omit<
  GetTranslatorParams,
  "locale" | "allowCacheWrite"
>;

/**
 * Get a server-side translator for the current execution context.
 *
 * - Automatically resolves the locale from the framework context.
 *
 * @platform Express
 */

// Signature: Without preKey
export function getTranslator<CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
  req: Request,
  params?: GetTranslatorExpressParams,
): Promise<TranslatorInstanceServer<GenMessages<CK>>>;

// Signature: With preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(
  config: IntorResolvedConfig,
  req: Request,
  params?: GetTranslatorExpressParams & { preKey?: PK },
): Promise<TranslatorInstanceServer<GenMessages<CK>, PK>>;

// Implementation
export async function getTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(
  config: IntorResolvedConfig,
  req: Request,
  params?: GetTranslatorExpressParams & { preKey?: PK },
) {
  const { preKey, handlers, plugins, readers } = params || {};

  return getTranslatorCore<CK, PK>(config, {
    locale: req.intor?.locale || config.defaultLocale,
    preKey,
    handlers,
    plugins,
    readers,
    allowCacheWrite: false,
  });
}
