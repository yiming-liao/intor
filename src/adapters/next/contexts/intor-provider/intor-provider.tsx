"use client";

import type { IntorProviderProps } from "./types";
import * as React from "react";
import { ConfigProvider } from "../../contexts/config";
import { LocaleProvider } from "../../contexts/locale";
import { MessagesProvider } from "../../contexts/messages";
import { TranslatorProvider } from "../../contexts/translator";

export const IntorProvider = ({
  value: { config, pathname, initialLocale, messages },
  children,
}: IntorProviderProps) => {
  return (
    <ConfigProvider value={{ config, pathname }}>
      <MessagesProvider value={{ messages }}>
        <LocaleProvider value={{ initialLocale }}>
          <TranslatorProvider>{children}</TranslatorProvider>
        </LocaleProvider>
      </MessagesProvider>
    </ConfigProvider>
  );
};
