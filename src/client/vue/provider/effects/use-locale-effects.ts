import type { IntorResolvedConfig } from "@/config";
import type { Locale } from "intor-translator";
import { watch, type Ref } from "vue";
import {
  setLocaleCookieBrowser,
  setDocumentLocale,
} from "@/client/shared/utils";

export function useLocaleEffects(
  config: IntorResolvedConfig,
  locale: Ref<Locale>,
) {
  // Sync locale-related browser side effects.
  watch(
    locale,
    (newLocale) => {
      setLocaleCookieBrowser(config.cookie, newLocale);
      setDocumentLocale(newLocale);
    },
    { immediate: true },
  );
}
