import type { IntorValue, IntorStore } from "./types";
import { Translator, type Locale, type LocaleMessages } from "intor-translator";
import { writable, derived, get, readable, type Readable } from "svelte/store";
import { createTranslatorBindings } from "./create-translator-bindings";
import { attachLocaleEffects } from "./effects/locale-effects";
import { attachMessagesEffects } from "./effects/messages-effects";

export function createIntorStore({
  config,
  locale: initialLocale,
  messages,
  handlers,
  plugins,
  onLocaleChange,
  isLoading: externalIsLoading,
}: IntorValue): IntorStore {
  // ---------------------------------------------------------------------------
  // Internal state
  // ---------------------------------------------------------------------------
  const locale = writable<Locale>(initialLocale);
  const runtimeMessages = writable<LocaleMessages | null>(null);
  const internalIsLoading = writable(false);

  // -----------------------------------------------------------------------------
  // Locale transition
  // -----------------------------------------------------------------------------
  /** Request a locale change. */
  async function setLocale(next: Locale) {
    const current = get(locale);
    if (next === current) return;
    locale.set(next);
    onLocaleChange?.(next); // Notify external listener (fire-and-forget)
  }

  // ---------------------------------------------------------------------------
  // Effective state
  // ---------------------------------------------------------------------------
  const externalIsLoadingStore: Readable<boolean> =
    externalIsLoading ?? readable(false);
  // external > internal
  const effectiveIsLoading = derived(
    [externalIsLoadingStore, internalIsLoading],
    ([$external, $internal]) => $external || $internal,
  );
  // runtime (client refetch) > initial > config (static)
  const effectiveMessages = derived(
    [runtimeMessages, messages ?? readable(undefined)],
    ([$runtime, $initial]) => $runtime || $initial || config.messages || {},
  );

  // ---------------------------------------------------------------------------
  // Translator
  // ---------------------------------------------------------------------------
  const translator = derived(
    [effectiveMessages, locale, effectiveIsLoading],
    ([$messages, $locale, $isLoading]) =>
      new Translator<unknown>({
        messages: $messages,
        locale: $locale,
        isLoading: $isLoading,
        fallbackLocales: config.fallbackLocales,
        loadingMessage: config.translator?.loadingMessage,
        missingMessage: config.translator?.missingMessage,
        handlers,
        plugins,
      }),
  );

  // ---------------------------------------------------------------------------
  // Side effects
  // ---------------------------------------------------------------------------
  attachLocaleEffects(locale, config);
  attachMessagesEffects({ config, locale, runtimeMessages, internalIsLoading });

  const { scoped, t, tRich } = createTranslatorBindings(translator);
  return {
    messages: effectiveMessages,
    locale,
    isLoading: effectiveIsLoading,
    setLocale,
    scoped,
    t,
    tRich,
  };
}
