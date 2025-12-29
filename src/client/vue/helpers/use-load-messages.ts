import type { IntorResolvedConfig } from "@/config";
import type { LocaleMessages } from "intor-translator";
import { ref, computed, onMounted, type Ref } from "vue";
import { deepMerge } from "@/core";
import { getClientLocale } from "../../shared/helpers";

interface UseLoadMessagesResult {
  initialLocale: string;
  messages: Ref<Readonly<LocaleMessages> | undefined>;
  isLoading: Ref<boolean>;
  onLocaleChange: (locale: string) => Promise<void>;
}

export function useLoadMessages(
  config: IntorResolvedConfig,
  loader: (locale: string) => Promise<LocaleMessages>,
): UseLoadMessagesResult {
  // ---------------------------------------------------------------------------
  // Initial locale
  // ---------------------------------------------------------------------------
  const initialLocale = getClientLocale(config);

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const messages = ref<LocaleMessages>();
  const isLoading = ref(true);
  let activeLocale = initialLocale;

  // ---------------------------------------------------------------------------
  // Locale change handler
  // ---------------------------------------------------------------------------
  const onLocaleChange = async (newLocale: string) => {
    activeLocale = newLocale;
    isLoading.value = true;

    const loaded = await loader(newLocale);

    // Ignore outdated results when locale changes again.
    if (activeLocale !== newLocale) return;

    messages.value = deepMerge(config.messages, loaded);
    isLoading.value = false;
  };

  // ---------------------------------------------------------------------------
  // Initial load
  // ---------------------------------------------------------------------------
  onMounted(() => onLocaleChange(initialLocale));

  return {
    initialLocale,
    messages: computed(() => messages.value),
    isLoading: computed(() => isLoading.value),
    onLocaleChange,
  };
}
