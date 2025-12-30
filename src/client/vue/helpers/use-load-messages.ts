import type { IntorResolvedConfig } from "@/config";
import type { LocaleMessages } from "intor-translator";
import { ref, onMounted, type Ref } from "vue";
import {
  deepMerge,
  type GenConfigKeys,
  type GenLocale,
  type GenMessages,
} from "@/core";
import { getClientLocale } from "../../shared/helpers";

interface UseLoadMessagesResult<CK extends GenConfigKeys = "__default__"> {
  initialLocale: GenLocale<CK>;
  messages: Ref<GenMessages<CK>>;
  isLoading: Ref<boolean>;
  onLocaleChange: (locale: GenLocale<CK>) => Promise<void>;
}

export function useLoadMessages<CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
  loader: (locale: string) => Promise<LocaleMessages>,
): UseLoadMessagesResult<CK> {
  // ---------------------------------------------------------------------------
  // Initial locale
  // ---------------------------------------------------------------------------
  const initialLocale = getClientLocale(config);

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const messages = ref<LocaleMessages>(config.messages || {});
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
    messages,
    isLoading,
    onLocaleChange,
  } as UseLoadMessagesResult<CK>;
}
