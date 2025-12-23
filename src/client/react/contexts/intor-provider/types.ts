import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type { Locale, LocaleMessages } from "intor-translator";
import type * as React from "react";

export interface IntorProviderProps {
  value: {
    config: IntorResolvedConfig;
    initialLocale: Locale;
    messages?: Readonly<LocaleMessages>;
    onLocaleChange?: (newLocale: string) => Promise<void> | void;
    isLoading?: boolean;
  };
  children: React.ReactNode;
}
