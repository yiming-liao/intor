import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenMessages } from "@/core";
import type { GetTranslatorParams, TranslatorInstanceServer } from "@/server";
import type { LocalizedNodeKeys } from "intor-translator";
import { getTranslator as getTranslatorCore } from "@/server";
import { getLocale } from "./get-locale";

type GetTranslatorNextParams = Omit<GetTranslatorParams, "locale">;

/**
 * Get a server-side translator for the current execution context.
 *
 * - Automatically resolves the locale from the framework context.
 *
 * @platform Next.js
 */

// Signature: Without preKey
export function getTranslator<CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
  params?: GetTranslatorNextParams,
): Promise<TranslatorInstanceServer<GenMessages<CK>>>;

// Signature: With preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(
  config: IntorResolvedConfig,
  params?: GetTranslatorNextParams & { preKey?: PK },
): Promise<TranslatorInstanceServer<GenMessages<CK>, PK>>;

// Implementation
export async function getTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(
  config: IntorResolvedConfig,
  params?: GetTranslatorNextParams & { preKey?: PK },
) {
  const { preKey, handlers, plugins, readers, allowCacheWrite } = params || {};
  return getTranslatorCore<CK, PK>(config, {
    locale: await getLocale(config),
    preKey,
    handlers,
    plugins,
    readers,
    allowCacheWrite,
  });
}
