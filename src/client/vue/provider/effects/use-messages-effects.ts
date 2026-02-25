import type { IntorResolvedConfig } from "../../../../config";
import type { LocaleMessages } from "intor-translator";
import { watch, type Ref } from "vue";
import { createRefetchMessages } from "../../../shared/messages";

/**
 * Attach message refetch side effects based on locale changes.
 *
 * - Skips initial run
 * - Aborts previous in-flight requests automatically
 * - Acts as a side-effect boundary (no state returned)
 */
export function useMessagesEffects(
  config: IntorResolvedConfig,
  locale: Ref<string>,
  runtimeMessages: Ref<LocaleMessages | null>,
  internalIsLoading: Ref<boolean>,
) {
  // Prepares message refetch function.
  const refetchMessages = createRefetchMessages({
    config,
    onLoadingStart: () => {
      internalIsLoading.value = true;
    },
    onLoadingEnd: () => {
      internalIsLoading.value = false;
    },
    onMessages: (messages) => {
      runtimeMessages.value = messages;
    },
  });

  // Refetch messages when locale changes (except initial render).
  let isInitial = true;
  watch(locale, (newLocale) => {
    if (isInitial) {
      isInitial = false;
      return;
    }
    refetchMessages(newLocale);
  });
}
