"use client";

import type { IntorTranslatorProviderProps } from "./types";
import { Translator } from "intor-translator";
import * as React from "react";
import { IntorTranslatorContext } from "./intor-translator-context";
import { useIntorConfig } from "@/adapters/next-client/contexts/intor-config";
import { useIntorMessages } from "@/adapters/next-client/contexts/intor-messages";
import { useIntorLocale } from "@/adapters/next-client/contexts/intor-locale";
import { useTranslateHandlers } from "@/adapters/next-client/contexts/translate-handlers";
import { useInitLoadingState } from "@/adapters/next-client/hooks/intor-translator/use-init-loading-state";

const EMPTY_OBJECT = Object.freeze({}) as Readonly<unknown>;

// Translator Provider
export const IntorTranslatorProvider = ({
  children,
}: IntorTranslatorProviderProps) => {
  const { config } = useIntorConfig();
  const { messages, isLoading } = useIntorMessages();
  const { locale } = useIntorLocale();
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
    <IntorTranslatorContext.Provider value={value}>
      {children}
    </IntorTranslatorContext.Provider>
  );
};
