import type { IntorResolvedConfig } from "@/config";
import type { MessagesReadOptions } from "@/core";
import { type GenConfigKeys } from "@/core";
import { intor as intorCore, type IntorResult } from "@/server";
import { getLocale } from "./get-locale";

/**
 * Next.js server-side bootstrap entry.
 *
 * @platform Next.js
 */
export async function intor<CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
  readOptions?: MessagesReadOptions,
): Promise<IntorResult<CK>> {
  return await intorCore(config, getLocale, { readOptions });
}
