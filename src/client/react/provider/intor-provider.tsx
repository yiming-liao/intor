"use client";

import type { IntorContextValue, IntorProviderProps } from "./types";
import { Translator, type Locale, type LocaleMessages } from "intor-translator";
import * as React from "react";
import { useLocaleEffects } from "./effects/use-locale-effects";
import { useMessagesEffects } from "./effects/use-messages-effects";

export const IntorContext = React.createContext<IntorContextValue | undefined>(
  undefined,
);

export function IntorProvider({
  value: {
    config,
    locale: initialLocale,
    messages,
    handlers,
    plugins,
    onLocaleChange,
    isLoading: externalIsLoading,
  },
  children,
}: IntorProviderProps) {
  // -----------------------------------------------------------------------------
  // Internal state
  // -----------------------------------------------------------------------------
  const [locale, setLocaleState] = React.useState<string>(initialLocale);
  const [runtimeMessages, setRuntimeMessages] =
    React.useState<LocaleMessages | null>(null);
  const [internalIsLoading, setInternalIsLoading] =
    React.useState<boolean>(false);

  // -----------------------------------------------------------------------------
  // Locale transition
  // -----------------------------------------------------------------------------
  /** Request a locale change. */
  const setLocale = React.useCallback(
    async (newLocale: Locale) => {
      if (newLocale === locale) return;
      setLocaleState(newLocale);
      onLocaleChange?.(newLocale); // Notify external listener (fire-and-forget)
    },
    [locale, onLocaleChange],
  );

  // -----------------------------------------------------------------------------
  // Effective state
  // -----------------------------------------------------------------------------
  // external > internal > localeTransitioning
  const effectiveIsLoading = !!externalIsLoading || internalIsLoading;
  // runtime (client refetch) > initial > config (static)
  const effectiveMessages = React.useMemo(
    () => runtimeMessages || messages || config.messages || {},
    [config.messages, messages, runtimeMessages],
  );

  // -----------------------------------------------------------------------------
  // Translator
  // -----------------------------------------------------------------------------
  const { loadingMessage, missingMessage } = config.translator ?? {};

  const translator = React.useMemo(() => {
    return new Translator<LocaleMessages>({
      messages: effectiveMessages,
      locale,
      isLoading: effectiveIsLoading,
      fallbackLocales: config.fallbackLocales,
      ...(loadingMessage !== undefined ? { loadingMessage } : {}),
      ...(missingMessage !== undefined ? { missingMessage } : {}),
      ...(handlers !== undefined ? { handlers } : {}),
      ...(plugins !== undefined ? { plugins } : {}),
    });
  }, [
    effectiveMessages,
    locale,
    effectiveIsLoading,
    config.fallbackLocales,
    loadingMessage,
    missingMessage,
    handlers,
    plugins,
  ]);

  // ---------------------------------------------------------------------------
  // Side effects
  // ---------------------------------------------------------------------------
  useLocaleEffects(config, locale);
  useMessagesEffects(config, locale, setRuntimeMessages, setInternalIsLoading);

  // Sync internal locale with external prop
  React.useEffect(() => {
    if (initialLocale !== locale) setLocaleState(initialLocale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLocale]);

  return (
    <IntorContext.Provider value={{ config, locale, setLocale, translator }}>
      {children}
    </IntorContext.Provider>
  );
}
