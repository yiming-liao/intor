import type { IntorValue } from "./types";
import { Translator, type LocaleMessages } from "intor-translator";
import { setContext } from "svelte";
import { writable, derived, get, readable } from "svelte/store";
import {
  resolveEffectiveIsLoading,
  resolveEffectiveMessages,
} from "../../shared/provider/effective-state";
import { attachLocaleEffects } from "./effects/attach-locale-effects";
import { attachMessagesEffects } from "./effects/attach-messages-effects";

export const INTOR_CONTEXT_KEY = Symbol("IntorContext");

export function buildIntorStores({
  config,
  locale: initialLocale,
  messages,
  handlers,
  hooks,
  onLocaleChange,
  isLoading: externalIsLoading,
}: IntorValue) {
  // ---------------------------------------------------------------------------
  // Internal state
  // ---------------------------------------------------------------------------
  const locale = writable<string>(initialLocale);
  const runtimeMessages = writable<LocaleMessages | null>(null);
  const internalIsLoading = writable(false);

  // -----------------------------------------------------------------------------
  // Locale transition
  // -----------------------------------------------------------------------------
  /** Request a locale change. */
  function setLocale(next: string) {
    const current = get(locale);
    if (next === current) return;
    locale.set(next);
    void onLocaleChange?.(next); // Notify external listener (fire-and-forget)
  }

  // ---------------------------------------------------------------------------
  // Effective state
  // ---------------------------------------------------------------------------
  const externalIsLoadingStore =
    typeof externalIsLoading === "object" && "subscribe" in externalIsLoading
      ? externalIsLoading
      : readable(!!externalIsLoading);
  const effectiveIsLoading = derived(
    [externalIsLoadingStore, internalIsLoading],
    ([$external, $internal]) => resolveEffectiveIsLoading($external, $internal),
  );

  const effectiveMessages = derived(runtimeMessages, ($runtime) =>
    resolveEffectiveMessages($runtime, messages, config.messages),
  );

  // ---------------------------------------------------------------------------
  // Translator
  // ---------------------------------------------------------------------------
  const { loadingMessage, missingMessage } = config.translator ?? {};

  const translator = derived(
    [effectiveMessages, locale, effectiveIsLoading],
    ([$messages, $locale, $isLoading]) =>
      new Translator({
        messages: $messages,
        locale: $locale,
        isLoading: $isLoading,
        fallbackLocales: config.fallbackLocales,
        ...(loadingMessage !== undefined ? { loadingMessage } : {}),
        ...(missingMessage !== undefined ? { missingMessage } : {}),
        ...(handlers !== undefined ? { handlers } : {}),
        ...(hooks !== undefined ? { hooks } : {}),
      }),
  );

  return {
    config,
    locale,
    setLocale,
    translator,
    runtimeMessages,
    internalIsLoading,
  };
}

/**
 * Svelte initializer for Intor.
 *
 * @public
 */
export function createIntorStore(value: IntorValue): void {
  const stores = buildIntorStores(value);

  attachLocaleEffects(stores.locale, value.config);
  attachMessagesEffects({
    config: value.config,
    locale: stores.locale,
    runtimeMessages: stores.runtimeMessages,
    internalIsLoading: stores.internalIsLoading,
  });

  setContext(INTOR_CONTEXT_KEY, stores);
}
