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
  let isFirstSync = true;

  return locale.subscribe((currentLocale) => {
    // Always sync document language
    setDocumentLocale(currentLocale);

    // -------------------------------------------------------------
    // First sync (initial mount / hydration)
    // -------------------------------------------------------------
    if (isFirstSync) {
      isFirstSync = false;

      const localeCookie = getLocaleCookieBrowser(cookie.name);
      const isFirstVisit = !localeCookie;

      if (
        shouldPersistOnFirstVisit(isFirstVisit, routing.firstVisit.persist) &&
        shouldPersist(cookie)
      ) {
        setLocaleCookieBrowser(cookie, currentLocale);
      }

      return;
    }

    // -------------------------------------------------------------
    // Subsequent locale changes (user-driven)
    // -------------------------------------------------------------
    if (shouldPersist(cookie)) {
      setLocaleCookieBrowser(cookie, currentLocale);
    }
  });
}
