"use client";

import * as React from "react";
import { IntorConfigProvider } from "./intor-config";
import { IntorLocaleProvider } from "./intor-locale";
import { IntorMessagesProvider } from "./intor-messages";
import { IntorTranslatorProvider } from "./intor-translator";
import type { IntorProviderProps } from "./intor-provider-types";

export const IntorProvider = ({
  value: { config, pathname, initialLocale, messages },
  children,
}: IntorProviderProps) => {
  return (
    <IntorConfigProvider value={{ config, pathname }}>
      <IntorMessagesProvider value={{ messages }}>
        <IntorLocaleProvider value={{ initialLocale }}>
          <IntorTranslatorProvider>{children}</IntorTranslatorProvider>
        </IntorLocaleProvider>
      </IntorMessagesProvider>
    </IntorConfigProvider>
  );
};
