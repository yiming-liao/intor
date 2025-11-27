import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type * as React from "react";
import { type Locale, type LocaleMessages } from "intor-translator";

export interface IntorProviderProps {
  value: {
    config: IntorResolvedConfig;
    initialLocale: Locale;
    pathname?: string;
    messages?: Readonly<LocaleMessages>;
    onLocaleChange?: (newLocale: string) => Promise<void> | void;
    isLoading?: boolean;
  };
  children: React.ReactNode;
}
