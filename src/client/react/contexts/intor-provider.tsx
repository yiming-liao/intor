"use client";

import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type { Locale, LocaleMessages } from "intor-translator";
import type * as React from "react";
import { ConfigProvider } from "./config";
import { LocaleProvider } from "./locale";
import { MessagesProvider } from "./messages";
import { TranslatorProvider } from "./translator";

export interface IntorProviderProps {
  value: {
    config: IntorResolvedConfig;
    initialLocale: Locale;
    initialMessages?: Readonly<LocaleMessages>;
    onLocaleChange?: (newLocale: string) => Promise<void> | void;
    isLoading?: boolean;
  };
  children: React.ReactNode;
}

export const IntorProvider = ({
  value: {
    config,
    initialLocale,
    initialMessages = config.messages,
    onLocaleChange,
    isLoading,
  },
  children,
}: IntorProviderProps) => {
  return (
    <ConfigProvider value={{ config }}>
      <LocaleProvider value={{ initialLocale, onLocaleChange }}>
        <MessagesProvider value={{ initialMessages }}>
          <TranslatorProvider value={{ isLoading }}>
            {children}
          </TranslatorProvider>
        </MessagesProvider>
      </LocaleProvider>
    </ConfigProvider>
  );
};
