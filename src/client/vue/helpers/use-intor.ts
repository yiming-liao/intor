import type { IntorConfig } from "../../../config";
import type { MessagesLoader } from "../../../core";
import type { IntorValue } from "../provider";
import { ref, onMounted } from "vue";
import { getClientLocale } from "intor";

/**
 * Client-side Intor runtime helper.
 *
 * Manages locale state and dynamic message loading
 * in pure client-side (SPA) environments.
 *
 * @public
 */
export function useIntor(
  config: IntorConfig,
  loader: MessagesLoader,
): Omit<IntorValue, "handlers" | "hooks"> {
  // ---------------------------------------------------------------------------
  // Initial locale
  // ---------------------------------------------------------------------------
  const locale = getClientLocale(config);

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const messages = ref(config.messages || {});
  const isLoading = ref(true);
  let activeLocale = locale;

  // ---------------------------------------------------------------------------
  // Locale change handler
  // ---------------------------------------------------------------------------
  const onLocaleChange = async (newLocale: string) => {
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
