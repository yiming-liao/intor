import type { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import type { Locale, LocaleMessages } from "intor-translator";
import type * as React from "react";

export interface IntorProviderProps {
  value: {
    config: IntorResolvedConfig;
    initialLocale: Locale;
    pathname: string;
    messages: Readonly<LocaleMessages>;
  };
  children: React.ReactNode;
}
