import type { IntorResolvedConfig } from "@/config";
import type { Writable } from "svelte/store";
import {
  getLocaleCookieBrowser,
  setDocumentLocale,
  setLocaleCookieBrowser,
} from "../../../shared/utils";

export function attachLocaleEffects(
  locale: Writable<string>,
  config: IntorResolvedConfig,
) {
  const { cookie, routing } = config;

  // Sync locale-related browser side effects.
  return locale.subscribe((value) => {
    // Always sync document language
    setDocumentLocale(value);

    const localeCookie = getLocaleCookieBrowser(cookie.name);
    const isFirstVisit = !localeCookie;

    if (!isFirstVisit || routing.firstVisit.persist) {
      setLocaleCookieBrowser(cookie, value);
    }
  });
}
