import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenMessages } from "@/core";
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
  ReplacementSchema = unknown,
>(
  config: IntorResolvedConfig,
  params?: GetTranslatorNextParams,
): Promise<TranslatorInstanceServer<GenMessages<CK>, ReplacementSchema>>;

// Signature: With preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = unknown,
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
    // NOTE:
    // The runtime implementation is intentionally erased.
    // Type safety is guaranteed by public type contracts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
}
