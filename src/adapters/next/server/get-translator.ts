import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenMessages, GenReplacements } from "@/core";
import type { GetTranslatorParams, TranslatorInstanceServer } from "@/server";
import type { LocalizedPreKey } from "intor-translator";
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
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = GenReplacements<CK>,
>(
  config: IntorResolvedConfig,
  params?: GetTranslatorNextParams,
): Promise<TranslatorInstanceServer<GenMessages<CK>, ReplacementSchema>>;

// Signature: With preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = GenReplacements<CK>,
  PK extends string = LocalizedPreKey<GenMessages<CK>>,
>(
  config: IntorResolvedConfig,
  params?: GetTranslatorNextParams & { preKey?: PK },
): Promise<TranslatorInstanceServer<GenMessages<CK>, ReplacementSchema, PK>>;

// Implementation
export async function getTranslator(
  config: IntorResolvedConfig,
  params?: GetTranslatorNextParams & { preKey?: string },
) {
  const { preKey, handlers, plugins, readers, allowCacheWrite } = params || {};
  return getTranslatorCore(config, {
    locale: await getLocale(config),
    preKey,
    handlers,
    plugins,
    readers,
    allowCacheWrite,
  });
}
