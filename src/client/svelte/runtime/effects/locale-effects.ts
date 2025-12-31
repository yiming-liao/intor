import type { IntorResolvedConfig } from "@/config";
import type { Writable } from "svelte/store";
import { shouldPersist, shouldPersistOnFirstVisit } from "@/policies";
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

    if (
      shouldPersistOnFirstVisit(isFirstVisit, routing.firstVisit.persist) &&
      shouldPersist(cookie)
    ) {
      setLocaleCookieBrowser(cookie, value);
    }
  });
}
