"use client";

import * as React from "react";
import {
  IntorConfigProvider,
  IntorLocaleProvider,
  IntorMessagesProvider,
  IntorTranslatorProvider,
} from "../../../dist/next";

export const IntorProvider = ({
  value: { config, pathname, initialLocale, messages },
  children,
}) => {
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
