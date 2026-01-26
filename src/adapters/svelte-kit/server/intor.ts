import type { IntorResolvedConfig } from "@/config";
import type { MessagesReaders, RuntimeFetch } from "@/core";
import type { Locale } from "intor-translator";
import { type GenConfigKeys } from "@/core";
import { intor as intorCore, type IntorValue } from "@/server";

/**
 * Initializes Intor for the current execution context.
 *
 * - Uses the locale resolved by the SvelteKit request lifecycle.
 * - Permits cache writes during server execution.
 * @platform SvelteKit
 */
export async function intor<CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
  locale: Locale,
  fetch: RuntimeFetch,
  options?: { readers?: MessagesReaders; allowCacheWrite?: boolean },
): Promise<IntorValue<CK>> {
  return await intorCore(config, locale, {
    readers: options?.readers,
    allowCacheWrite: options?.allowCacheWrite ?? true,
    fetch,
  });
}
