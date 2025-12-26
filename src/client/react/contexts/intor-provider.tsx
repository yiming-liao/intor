"use client";

import type { IntorInitialValue } from "@/client/shared/types/contexts";
import type { GenConfigKeys } from "@/shared/types";
import type * as React from "react";
import { ConfigProvider } from "./config";
import { LocaleProvider } from "./locale";
import { MessagesProvider } from "./messages";
import { TranslatorProvider } from "./translator";

export interface IntorProviderProps<CK extends GenConfigKeys = "__default__"> {
  value: IntorInitialValue<CK>;
  children: React.ReactNode;
}

export const IntorProvider = <CK extends GenConfigKeys = "__default__">({
  value: {
    config,
    initialLocale,
    initialMessages = config.messages,
    onLocaleChange,
    isLoading,
  },
  children,
}: IntorProviderProps<CK>) => {
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
