import type { CreateIntorOptions, IntorRuntime } from "./types";
import type { GenConfigKeys, GenLocale } from "@/core";
import { Translator, type LocaleMessages } from "intor-translator";
import { writable, derived, get, readable, type Readable } from "svelte/store";
import { createIntorApi } from "@/client/svelte/runtime/create-intor-api";
import { attachLocaleEffects } from "./effects/locale-effects";
import { attachMessagesEffects } from "./effects/messages-effects";

export function createIntor<CK extends GenConfigKeys = "__default__">({
  config,
  locale: initialLocale,
  messages,
  handlers,
  plugins,
  onLocaleChange,
  isLoading: externalIsLoading,
}: CreateIntorOptions<CK>): IntorRuntime<CK> {
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
  async function setLocale(next: GenLocale<CK>) {
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
  const detachLocaleEffects = attachLocaleEffects(locale, config);
  const detachMessagesEffects = attachMessagesEffects({
    config,
    locale,
    runtimeMessages,
    internalIsLoading,
  });

  const { scoped, t, tRaw, tRich } = createIntorApi(translator);
  return {
    messages: effectiveMessages,
    locale,
    isLoading: effectiveIsLoading,
    setLocale,
    scoped,
    t,
    tRaw,
    tRich,

    // optional cleanup
    destroy() {
      detachLocaleEffects();
      detachMessagesEffects();
    },
  } as unknown as IntorRuntime<CK>;
}
