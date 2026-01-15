import type { IntorValue } from "../store";
import type { IntorResolvedConfig } from "@/config";
import type { Locale, LocaleMessages } from "intor-translator";
import { writable } from "svelte/store";
import { mergeMessages } from "@/core";
import { getClientLocale } from "../../shared/helpers";

export function createIntor(
  config: IntorResolvedConfig,
  loader: (locale: Locale) => Promise<LocaleMessages>,
): Omit<IntorValue, "handlers" | "plugins"> {
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
