"use client";

import type { TranslatorProviderProps } from "./types";
import { Translator } from "intor-translator";
import * as React from "react";
import { useConfig } from "@/client/react/contexts/config";
import { useLocale } from "@/client/react/contexts/locale";
import { useMessages } from "@/client/react/contexts/messages";
import { useTranslateHandlers } from "@/client/react/contexts/translate-handlers";
import { TranslatorContext } from "./context";

// Translator Provider
export function TranslatorProvider({
  value: { isLoading: externalIsLoading },
  children,
}: TranslatorProviderProps) {
  const { config } = useConfig();
  const { messages, isLoading: internalIsLoading } = useMessages();
  const { locale } = useLocale();
  const translateHandlers = useTranslateHandlers();
  const { fallbackLocales, translator: translatorOptions } = config;

  const isLoading = Boolean(externalIsLoading ?? internalIsLoading);

  const translator = React.useMemo(() => {
    return new Translator({
      messages,
      locale,
      isLoading,
      fallbackLocales,
      loadingMessage: translatorOptions?.loadingMessage,
      placeholder: translatorOptions?.placeholder,
      handlers: translateHandlers,
    });
  }, [
    messages,
    locale,
    isLoading,
    fallbackLocales,
    translateHandlers,
    translatorOptions?.loadingMessage,
    translatorOptions?.placeholder,
  ]);

  return (
    <TranslatorContext.Provider value={{ translator }}>
      {children}
    </TranslatorContext.Provider>
  );
}
