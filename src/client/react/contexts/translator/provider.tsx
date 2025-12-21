"use client";

import type { TranslatorProviderProps } from "./types";
import { Translator } from "intor-translator";
import * as React from "react";
import { useConfig } from "@/client/react/contexts/config";
import { useLocale } from "@/client/react/contexts/locale";
import { useMessages } from "@/client/react/contexts/messages";
import { useTranslatorRuntime } from "@/client/react/contexts/translator-runtime";
import { TranslatorContext } from "./context";

export function TranslatorProvider({
  value: { isLoading: externalIsLoading } = {},
  children,
}: TranslatorProviderProps) {
  const { config } = useConfig();
  const { messages, isLoading: internalIsLoading } = useMessages();
  const { locale } = useLocale();
  const runtime = useTranslatorRuntime();
  const isLoading = Boolean(externalIsLoading ?? internalIsLoading);

  const translator = React.useMemo(() => {
    return new Translator<unknown>({
      messages,
      locale,
      isLoading,
      fallbackLocales: config.fallbackLocales,
      loadingMessage: config.translator?.loadingMessage,
      placeholder: config.translator?.placeholder,
      handlers: runtime?.handlers,
      plugins: runtime?.plugins,
    });
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
    <TranslatorContext.Provider value={{ translator }}>
      {children}
    </TranslatorContext.Provider>
  );
}
