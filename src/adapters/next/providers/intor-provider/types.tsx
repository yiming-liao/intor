import * as React from "react";
import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import { Locale, LocaleNamespaceMessages } from "intor-translator";

export interface IntorProviderProps {
  value: {
    config: IntorResolvedConfig;
    initialLocale: Locale;
    pathname: string;
    messages: Readonly<LocaleNamespaceMessages>;
  };
  children: React.ReactNode;
}
