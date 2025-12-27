import type { IntorInitialValue } from "@/client/shared/types/contexts";
import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys } from "@/shared/types";
import type { Translator } from "intor-translator";
import type * as React from "react";
import { type Locale, type LocaleMessages } from "intor-translator";

export type IntorContextValue = {
  config: IntorResolvedConfig;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Readonly<LocaleMessages>;
  isLoading: boolean;
  translator: Translator<unknown>;
};

export interface IntorProviderProps<CK extends GenConfigKeys = "__default__"> {
  value: IntorInitialValue<CK>;
  children: React.ReactNode;
}
