import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenLocale, GenMessages } from "@/core";
import type {
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import type { Translator } from "intor-translator";
import type * as React from "react";

export interface IntorProviderProps<CK extends GenConfigKeys = "__default__"> {
  value: {
    config: IntorResolvedConfig;
    locale: GenLocale<CK>;
    messages?: Readonly<GenMessages<CK>>;
    isLoading?: boolean;
    handlers?: TranslateHandlers;
    plugins?: (TranslatorPlugin | TranslateHook)[];
    onLocaleChange?: (newLocale: GenLocale<CK>) => Promise<void> | void;
  };
  children: React.ReactNode;
}

export type IntorContextValue<CK extends GenConfigKeys = "__default__"> = {
  config: IntorResolvedConfig;
  locale: GenLocale<CK>;
  setLocale: (locale: GenLocale<CK>) => void;
  messages: Readonly<GenMessages<CK>>;
  isLoading: boolean;
  translator: Translator<unknown>;
};
