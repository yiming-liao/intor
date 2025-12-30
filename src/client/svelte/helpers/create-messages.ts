import type { IntorResolvedConfig } from "@/config";
import type { LocaleMessages } from "intor-translator";
import { writable, type Writable } from "svelte/store";
import {
  deepMerge,
  type GenConfigKeys,
  type GenLocale,
  type GenMessages,
} from "@/core";
import { getClientLocale } from "../../shared/helpers";

interface CreateMessagesRuntimeResult<
  CK extends GenConfigKeys = "__default__",
> {
  initialLocale: GenLocale<CK>;
  messages: Writable<GenMessages<CK>>;
  isLoading: Writable<boolean>;
  onLocaleChange: (locale: GenLocale<CK>) => Promise<void>;
}

export function createMessages<CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
  loader: (locale: string) => Promise<LocaleMessages>,
): CreateMessagesRuntimeResult<CK> {
  // ---------------------------------------------------------------------------
  // Initial locale
  // ---------------------------------------------------------------------------
  const initialLocale = getClientLocale(config);

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const messages = writable<LocaleMessages>(config.messages || {});
  const isLoading = writable<boolean>(true);
  let activeLocale = initialLocale;

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
  onLocaleChange(initialLocale);

  return {
    initialLocale,
    messages,
    isLoading,
    onLocaleChange,
  } as CreateMessagesRuntimeResult<CK>;
}
