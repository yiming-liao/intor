"use client";

import type { IntorProviderProps } from "./types";
import * as React from "react";
import { ConfigProvider } from "../config";
import { LocaleProvider } from "../locale";
import { MessagesProvider } from "../messages";
import { TranslatorProvider } from "../translator";

export const IntorProvider = ({
  value: {
    config,
    pathname = "",
    initialLocale,
    messages = config.messages,
    onLocaleChange,
    isLoading,
  },
  children,
}: IntorProviderProps) => {
  return (
    <ConfigProvider value={{ config, pathname }}>
      <MessagesProvider value={{ messages }}>
        <LocaleProvider value={{ initialLocale, onLocaleChange }}>
          <TranslatorProvider value={{ isLoading }}>
            {children}
          </TranslatorProvider>
        </LocaleProvider>
      </MessagesProvider>
    </ConfigProvider>
  );
};
