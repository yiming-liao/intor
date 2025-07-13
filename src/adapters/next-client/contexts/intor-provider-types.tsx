import * as React from "react";
import { IntorResolvedConfig } from "@/modules/intor-config/types/define-intor-config-types";
import { Locale, LocaleNamespaceMessages } from "intor-translator";

export type IntorProviderProps = {
  value: {
    config: IntorResolvedConfig;
    initialLocale: Locale;
    pathname: string;
    messages: Readonly<LocaleNamespaceMessages>;
  };
  children: React.ReactNode;
};
