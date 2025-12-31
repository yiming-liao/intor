import type { IntorResolvedConfig } from "@/config";
import type { Locale } from "intor-translator";
import { watch, type Ref } from "vue";
import { shouldPersist, shouldPersistOnFirstVisit } from "@/policies";
import {
  setLocaleCookieBrowser,
  setDocumentLocale,
  getLocaleCookieBrowser,
} from "../../../shared/utils";

export function useLocaleEffects(
  config: IntorResolvedConfig,
  locale: Ref<Locale>,
) {
  const { cookie, routing } = config;

  // Sync locale-related browser side effects.
  watch(
    locale,
    (newLocale) => {
      // Always sync document language
      setDocumentLocale(newLocale);

      const localeCookie = getLocaleCookieBrowser(cookie.name);
      const isFirstVisit = !localeCookie;

      if (
        shouldPersistOnFirstVisit(isFirstVisit, routing.firstVisit.persist) &&
        shouldPersist(cookie)
      ) {
        setLocaleCookieBrowser(cookie, newLocale);
      }
    },
    { immediate: true },
  );
}
