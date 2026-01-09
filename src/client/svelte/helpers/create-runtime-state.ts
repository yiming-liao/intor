import type { IntorResolvedConfig } from "@/config";
import type { Locale, LocaleMessages } from "intor-translator";
import { writable, type Writable } from "svelte/store";
import { mergeMessages } from "@/core";
import { getClientLocale } from "../../shared/helpers";

interface RuntimeState {
  config: IntorResolvedConfig;
  locale: Locale;
  messages: Writable<LocaleMessages>;
  onLocaleChange: (locale: Locale) => Promise<void>;
  isLoading: Writable<boolean>;
}

export function createRuntimeState(
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
  const messages = writable<LocaleMessages>(config.messages || {});
  const isLoading = writable<boolean>(true);
  let activeLocale = locale;

  // ---------------------------------------------------------------------------
  // Locale change handler
  // ---------------------------------------------------------------------------
  const onLocaleChange = async (newLocale: Locale) => {
    activeLocale = newLocale;
    isLoading.set(true);

    const loaded = await loader(newLocale);

    // Ignore outdated results when locale changes again.
    if (activeLocale !== newLocale) return;

    messages.set(
      mergeMessages(config.messages, loaded, { config, locale: newLocale }),
    );
    isLoading.set(false);
  };

  // ---------------------------------------------------------------------------
  // Initial load
  // ---------------------------------------------------------------------------
  onLocaleChange(locale);

  return {
    config,
    locale,
    messages,
    isLoading,
    onLocaleChange,
  };
}
