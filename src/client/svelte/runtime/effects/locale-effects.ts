import type { IntorResolvedConfig } from "@/config";
import type { Writable } from "svelte/store";
import {
  setDocumentLocale,
  setLocaleCookieBrowser,
} from "@/client/shared/utils";

/**
 * Attach locale-related browser side effects.
 *
 * - Sync locale cookie
 * - Sync <html lang="">
 *
 * Returns an unsubscribe function.
 */
export function attachLocaleEffects(
  locale: Writable<string>,
  config: IntorResolvedConfig,
) {
  return locale.subscribe((value) => {
    setLocaleCookieBrowser(config.cookie, value);
    setDocumentLocale(value);
  });
}
