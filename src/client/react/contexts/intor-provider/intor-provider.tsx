"use client";

import type { IntorProviderProps } from "./types";
import { ConfigProvider } from "../config";
import { LocaleProvider } from "../locale";
import { MessagesProvider } from "../messages";
import { TranslatorProvider } from "../translator";

export const IntorProvider = ({
  value: {
    config,
    initialLocale,
    messages = config.messages,
    onLocaleChange,
    isLoading,
  },
  children,
}: IntorProviderProps) => {
  return (
    <ConfigProvider value={{ config }}>
      <LocaleProvider value={{ initialLocale, onLocaleChange }}>
        <MessagesProvider value={{ messages }}>
          <TranslatorProvider value={{ isLoading }}>
            {children}
          </TranslatorProvider>
        </MessagesProvider>
      </LocaleProvider>
    </ConfigProvider>
  );
};
