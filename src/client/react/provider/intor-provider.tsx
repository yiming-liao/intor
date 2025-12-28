"use client";

import type { IntorContextValue, IntorProviderProps } from "./types";
import type { GenConfigKeys } from "@/core/types";
import { Translator, type LocaleMessages } from "intor-translator";
import * as React from "react";
import { LocaleEffects } from "@/client/react/provider/effects/locale-effects";
import { MessagesEffects } from "@/client/react/provider/effects/messages-effects";

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
  // Internal states
  // -----------------------------------------------------------------------------
  const [locale, setLocaleState] = React.useState<string>(initialLocale);
  const [runtimeMessages, setRuntimeMessages] =
    React.useState<LocaleMessages | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  /**
   * Request a locale change.
   */
  const setLocale = React.useCallback(
    async (newLocale: string) => {
      if (newLocale === locale) return;
      setLocaleState(newLocale);
      onLocaleChange?.(newLocale); // Notify external listener (fire-and-forget)
    },
    [locale, onLocaleChange],
  );

  /**
   * Treat locale changes as a loading boundary to avoid transient missing states.
   * isLoading defaults to false, but is eagerly set to true on locale switches.
   */
  const prevLocaleRef = React.useRef(locale);
  // eslint-disable-next-line react-hooks/refs
  const localeChanged = prevLocaleRef.current !== locale;
  React.useEffect(() => {
    prevLocaleRef.current = locale;
  }, [locale]);

  // -----------------------------------------------------------------------------
  // Effective state
  // -----------------------------------------------------------------------------
  const effectiveIsLoading = !!externalIsLoading || isLoading || localeChanged;
  // runtime (client refetch) → initial → config (static)
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
      placeholder: config.translator?.placeholder,
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
      <LocaleEffects config={config} locale={locale} />
      <MessagesEffects
        config={config}
        locale={locale}
        setRuntimeMessages={setRuntimeMessages}
        setIsLoading={setIsLoading}
      />

      {children}
    </IntorContext.Provider>
  );
};
