import type { IntorValue } from "../provider";
import type { IntorConfig } from "intor";
import type { Locale, LocaleMessages } from "intor-translator";
import { ref, onMounted } from "vue";
import { getClientLocale } from "intor";

export function useIntor(
  config: IntorConfig,
  loader: (config: IntorConfig, locale: Locale) => Promise<LocaleMessages>,
): Omit<IntorValue, "handlers" | "plugins"> {
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

    const loaded = await loader(config, newLocale);

    // Ignore outdated results when locale changes again.
    if (activeLocale !== newLocale) return;

    messages.value = loaded;
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
