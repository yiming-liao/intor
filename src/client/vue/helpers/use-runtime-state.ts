import type { IntorResolvedConfig } from "@/config";
import type { Locale, LocaleMessages } from "intor-translator";
import { ref, onMounted, type Ref } from "vue";
import { mergeMessages } from "@/core";
import { getClientLocale } from "../../shared/helpers";

export interface RuntimeState {
  config: IntorResolvedConfig;
  locale: Locale;
  messages: Ref<LocaleMessages>;
  onLocaleChange: (locale: Locale) => Promise<void>;
  isLoading: Ref<boolean>;
}

export function useRuntimeState(
  config: IntorResolvedConfig,
  loader: (locale: Locale) => Promise<LocaleMessages>,
): RuntimeState {
  // ---------------------------------------------------------------------------
  // Initial locale
  // ---------------------------------------------------------------------------
  const locale = getClientLocale(config);

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const messages = ref<LocaleMessages>(config.messages || {});
  const isLoading = ref(true);
  let activeLocale = locale;

  // ---------------------------------------------------------------------------
  // Locale change handler
  // ---------------------------------------------------------------------------
  const onLocaleChange = async (newLocale: Locale) => {
    activeLocale = newLocale;
    isLoading.value = true;

    const loaded = await loader(newLocale);

    // Ignore outdated results when locale changes again.
    if (activeLocale !== newLocale) return;

    messages.value = mergeMessages(config.messages, loaded, {
      config,
      locale: newLocale,
    });
    isLoading.value = false;
  };

  // ---------------------------------------------------------------------------
  // Initial load
  // ---------------------------------------------------------------------------
  onMounted(() => onLocaleChange(locale));

  return {
    config,
    locale,
    messages,
    isLoading,
    onLocaleChange,
  };
}
