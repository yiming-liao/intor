import type { IntorResolvedConfig } from "@/config";
import type { MessagesReadOptions } from "@/core";
import { type GenConfigKeys } from "@/core";
import { intor as intorCore, type IntorResult } from "@/server";
import { getLocale } from "./get-locale";

/**
 * Initializes Intor for the current execution context.
 *
 *  - Automatically resolves the locale from the framework context.
 *
 * @platform Next.js
 */
export async function intor<CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
  readOptions?: MessagesReadOptions,
): Promise<IntorResult<CK>> {
  return await intorCore(config, getLocale, {
    readOptions,
    allowCacheWrite: true,
  });
}
