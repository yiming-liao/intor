import type { IntorValue } from "./types";
import { Translator, type Locale, type LocaleMessages } from "intor-translator";
import { setContext } from "svelte";
import { writable, derived, get, readable } from "svelte/store";
import { attachLocaleEffects } from "./effects/locale-effects";
import { attachMessagesEffects } from "./effects/messages-effects";

export const INTOR_CONTEXT_KEY = Symbol("intor:svelte");

export function createIntorStore({
  config,
  locale: initialLocale,
  messages,
  handlers,
  plugins,
  onLocaleChange,
  isLoading: externalIsLoading,
}: IntorValue): void {
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
  function setLocale(next: Locale) {
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
  // external > internal
  const effectiveIsLoading = derived(
    [externalIsLoadingStore, internalIsLoading],
    ([$external, $internal]) => $external || $internal,
  );
  // runtime (client refetch) > initial > config (static)
  const initialMessagesStore = readable(messages || config.messages || {});
  const effectiveMessages = derived(
    [runtimeMessages, initialMessagesStore],
    ([$runtime, $initial]) => $runtime || $initial,
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
        ...(plugins !== undefined ? { plugins } : {}),
      }),
  );

  // ---------------------------------------------------------------------------
  // Side effects
  // ---------------------------------------------------------------------------
  attachLocaleEffects(locale, config);
  attachMessagesEffects({ config, locale, runtimeMessages, internalIsLoading });

  setContext(INTOR_CONTEXT_KEY, { config, locale, setLocale, translator });
}
