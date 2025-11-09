"use client";

import type { TranslatorProviderProps } from "./types";
import { Translator } from "intor-translator";
import * as React from "react";
import { TranslatorContext } from "./context";
import { useConfig } from "@/adapters/next/contexts/config";
import { useMessages } from "@/adapters/next/contexts/messages";
import { useLocale } from "@/adapters/next/contexts/locale";
import { useTranslateHandlers } from "@/adapters/next/contexts/translate-handlers";
import { useInitLoadingState } from "@/adapters/next/contexts/translator/utils/use-init-loading-state";

const EMPTY_OBJECT = Object.freeze({}) as Readonly<unknown>;

// Translator Provider
export function TranslatorProvider({ children }: TranslatorProviderProps) {
  const { config } = useConfig();
  const { messages, isLoading } = useMessages();
  const { locale } = useLocale();
  const translatorHandlers = useTranslateHandlers();
  const { fallbackLocales, translator: translatorOptions } = config;

  // Initialize before CSR loading state if using lazy load
  const isBeforeCSRLoading = useInitLoadingState(config);

  // Context value
  const value = React.useMemo(() => {
    const translator = new Translator<unknown>({
      messages: messages || EMPTY_OBJECT,
      locale,
      fallbackLocales,
      loadingMessage: translatorOptions?.loadingMessage,
      placeholder: translatorOptions?.placeholder,
      handlers: translatorHandlers,
    });
    translator.setLoading(isBeforeCSRLoading || isLoading);
    return { translator };
  }, [
    fallbackLocales,
    isBeforeCSRLoading,
    isLoading,
    locale,
    messages,
    translatorHandlers,
    translatorOptions?.loadingMessage,
    translatorOptions?.placeholder,
  ]);

  return (
    <TranslatorContext.Provider value={value}>
      {children}
    </TranslatorContext.Provider>
  );
}
