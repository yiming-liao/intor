import type { IntorResolvedConfig } from "../../../../config";
import type { Locale } from "intor-translator";
import { watch, type Ref } from "vue";
import { shouldPersistOnFirstVisit } from "../../../../policies";
import {
  setLocaleCookie,
  setDocumentLocale,
  getLocaleFromCookie,
} from "../../../shared/utils";

export function useLocaleEffects(
  config: IntorResolvedConfig,
  locale: Ref<Locale>,
) {
  const { cookie, routing } = config;
  let isFirstSync = true;

  watch(
    locale,
    (currentLocale) => {
      // Always sync document language
      setDocumentLocale(currentLocale);

      // -------------------------------------------------------------
      // First sync (initial mount / hydration)
      // -------------------------------------------------------------
      if (isFirstSync) {
        isFirstSync = false;

        const localeCookie = getLocaleFromCookie(cookie.name);
        const isFirstVisit = !localeCookie;

        if (
          shouldPersistOnFirstVisit(
            isFirstVisit,
            routing.inbound.firstVisit.persist,
          ) &&
          cookie.persist
        ) {
          setLocaleCookie(cookie, currentLocale);
        }

        return;
      }

      // -------------------------------------------------------------
      // Subsequent locale changes (user-driven)
      // -------------------------------------------------------------
      if (cookie.persist) {
        setLocaleCookie(cookie, currentLocale);
      }
    },
    { immediate: true },
  );
}
