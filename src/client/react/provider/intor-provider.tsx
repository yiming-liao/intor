"use client";

import type { IntorContextValue, IntorProviderProps } from "./types";
import type { GenConfigKeys } from "@/core";
import { Translator, type LocaleMessages } from "intor-translator";
import * as React from "react";
import { useLocaleEffects } from "@/client/react/provider/effects/use-locale-effects";
import { useMessagesEffects } from "@/client/react/provider/effects/use-messages-effects";

export const IntorContext = React.createContext<IntorContextValue | undefined>(
  undefined,
);

export const IntorProvider = <CK extends GenConfigKeys = "__default__">({
  value: {
    config,
    initialLocale,
    initialMessages,
    handlers,
    plugins,
    onLocaleChange,
    isLoading: externalIsLoading,
  },
  children,
}: IntorProviderProps<CK>) => {
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
    async (newLocale: string) => {
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
    () => runtimeMessages || initialMessages || config.messages || {},
    [config.messages, initialMessages, runtimeMessages],
  );

  // -----------------------------------------------------------------------------
  // Translator
  // -----------------------------------------------------------------------------
  const translator = React.useMemo(() => {
    return new Translator<unknown>({
      messages: effectiveMessages,
      locale,
      isLoading: effectiveIsLoading,
      fallbackLocales: config.fallbackLocales,
      loadingMessage: config.translator?.loadingMessage,
      missingMessage: config.translator?.missingMessage,
      handlers,
      plugins,
    });
  }, [
    effectiveMessages,
    locale,
    effectiveIsLoading,
    config,
    handlers,
    plugins,
  ]);

  // ---------------------------------------------------------------------------
  // Side effects
  // ---------------------------------------------------------------------------
  useLocaleEffects(config, locale);
  useMessagesEffects(config, locale, setRuntimeMessages, setInternalIsLoading);

  return (
    <IntorContext.Provider
      value={{
        config,
        locale,
        setLocale,
        messages: effectiveMessages,
        isLoading: effectiveIsLoading,
        translator,
      }}
    >
      {children}
    </IntorContext.Provider>
  );
};
