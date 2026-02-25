import type { IntorResolvedConfig } from "../../../config";
import type { MessagesReaders } from "../../../core";
import { type GenConfigKeys } from "../../../core";
import { intor as intorCore, type IntorValue } from "../../../server";
import { getLocale } from "./get-locale";

/**
 * Initializes Intor for the current execution context.
 *
 * - Automatically resolves the locale from the framework context.
 * - Permits cache writes during server execution.
 * @platform Next.js
 */
export async function intor<CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
  options?: { readers?: MessagesReaders; allowCacheWrite?: boolean },
): Promise<IntorValue<CK>> {
  const { readers } = options ?? {};

  return await intorCore(config, await getLocale(config), {
    ...(readers !== undefined ? { readers } : {}),
    allowCacheWrite: options?.allowCacheWrite ?? true,
  });
}
