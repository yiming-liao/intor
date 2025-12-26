"use client";

import { Translator } from "intor-translator";
import * as React from "react";
import { useConfig } from "@/client/react/contexts/config";
import { useLocale } from "@/client/react/contexts/locale";
import { useMessages } from "@/client/react/contexts/messages";
import { useTranslatorRuntime } from "@/client/react/contexts/translator-runtime";
import { TranslatorContext } from "./context";

export type TranslatorProviderProps = {
  value?: {
    isLoading?: boolean;
  };
  children: React.ReactNode;
};

export function TranslatorProvider({
  value: { isLoading: externalIsLoading } = {},
  children,
}: TranslatorProviderProps) {
  const { config } = useConfig();
  const { locale } = useLocale();
  const { messages, isLoading: internalIsLoading } = useMessages();
  const runtime = useTranslatorRuntime();

  // Treat locale changes as a loading boundary to avoid transient missing states.
  // isLoading defaults to false, but is eagerly set to true on locale switches.
  const prevLocaleRef = React.useRef(locale);
  // eslint-disable-next-line react-hooks/refs -- intentional render-time read to detect locale switches
  const localeChanged = prevLocaleRef.current !== locale;
  React.useEffect(() => {
    prevLocaleRef.current = locale;
  }, [locale]);
  const isLoading = !!externalIsLoading || internalIsLoading || localeChanged;

  const value = React.useMemo(() => {
    const translator = new Translator<unknown>({
      messages,
      locale,
      isLoading,
      fallbackLocales: config.fallbackLocales,
      loadingMessage: config.translator?.loadingMessage,
      placeholder: config.translator?.placeholder,
      handlers: runtime?.handlers,
      plugins: runtime?.plugins,
    });
    return { translator };
  }, [
    messages,
    locale,
    isLoading,
    config.fallbackLocales,
    config.translator?.loadingMessage,
    config.translator?.placeholder,
    runtime?.handlers,
    runtime?.plugins,
  ]);

  return (
    <TranslatorContext.Provider value={value}>
      {children}
    </TranslatorContext.Provider>
  );
}
