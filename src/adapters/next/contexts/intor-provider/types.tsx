import * as React from "react";
import type { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import { Locale, LocaleMessages } from "intor-translator";

export interface IntorProviderProps {
  value: {
    config: IntorResolvedConfig;
    initialLocale: Locale;
    pathname: string;
    messages: Readonly<LocaleMessages>;
  };
  children: React.ReactNode;
}
