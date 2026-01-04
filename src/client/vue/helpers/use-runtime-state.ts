import type { RuntimeStateCore } from "../../shared/types";
import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenMessages } from "@/core";
import type { LocaleMessages } from "intor-translator";
import { ref, onMounted, type Ref } from "vue";
import { mergeMessages } from "@/core";
import { getClientLocale } from "../../shared/helpers";

export interface RuntimeState<CK extends GenConfigKeys = "__default__">
  extends RuntimeStateCore<CK> {
  messages: Ref<GenMessages<CK>>;
  isLoading: Ref<boolean>;
}

export function useRuntimeState<CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
  loader: (locale: string) => Promise<LocaleMessages>,
): RuntimeState<CK> {
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
  const onLocaleChange = async (newLocale: string) => {
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
  } as RuntimeState<CK>;
}
