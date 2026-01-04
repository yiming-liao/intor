import type { RuntimeStateCore } from "../../shared/types";
import type { IntorResolvedConfig } from "@/config";
import type { LocaleMessages } from "intor-translator";
import { writable, type Writable } from "svelte/store";
import { deepMerge, type GenConfigKeys, type GenMessages } from "@/core";
import { getClientLocale } from "../../shared/helpers";

interface RuntimeState<CK extends GenConfigKeys = "__default__">
  extends RuntimeStateCore<CK> {
  messages: Writable<GenMessages<CK>>;
  isLoading: Writable<boolean>;
}

export function createRuntimeState<CK extends GenConfigKeys = "__default__">(
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
  const messages = writable<LocaleMessages>(config.messages || {});
  const isLoading = writable<boolean>(true);
  let activeLocale = locale;

  // ---------------------------------------------------------------------------
  // Locale change handler
  // ---------------------------------------------------------------------------
  const onLocaleChange = async (newLocale: string) => {
    activeLocale = newLocale;
    isLoading.set(true);

    const loaded = await loader(newLocale);

    // Ignore outdated results when locale changes again.
    if (activeLocale !== newLocale) return;

    messages.set(deepMerge(config.messages, loaded));
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
  } as RuntimeState<CK>;
}
