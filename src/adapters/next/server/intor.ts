import type { IntorResolvedConfig } from "@/config";
import type { MessagesReaders } from "@/core";
import { type GenConfigKeys } from "@/core";
import { intor as intorCore, type IntorResult } from "@/server";
import { getLocale } from "./get-locale";

/**
 * Initializes Intor for the current execution context.
 *
 * - Automatically resolves the locale from the framework context.
 * - Acts as the bootstrap entry where cache writes are permitted.
 * @platform Next.js
 */
export async function intor<CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
  readers?: MessagesReaders,
): Promise<IntorResult<CK>> {
  return await intorCore(config, getLocale, {
    readers,
    allowCacheWrite: true,
  });
}
