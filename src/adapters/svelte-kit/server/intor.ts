import type { IntorResolvedConfig } from "@/config";
import type { MessagesReaders, RuntimeFetch } from "@/core";
import type { Locale, LocaleMessages } from "intor-translator";
import {
  intor as intorCore,
  type IntorValue as IntorValueCore,
} from "@/server";

interface IntorValue extends Pick<IntorValueCore, "config"> {
  locale: Locale;
  messages: Readonly<LocaleMessages>;
}

/**
 * Initializes Intor for the current execution context.
 *
 * - Uses the locale resolved by the SvelteKit request lifecycle.
 * - Permits cache writes during server execution.
 * @platform SvelteKit
 */
export async function intor(
  config: IntorResolvedConfig,
  locale: Locale,
  fetch: RuntimeFetch,
  options?: { readers?: MessagesReaders; allowCacheWrite?: boolean },
): Promise<IntorValue> {
  return await intorCore(config, locale, {
    readers: options?.readers,
    allowCacheWrite: options?.allowCacheWrite ?? true,
    fetch,
  });
}
