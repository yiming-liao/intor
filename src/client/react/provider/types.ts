import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenLocale, GenMessages } from "@/core";
import type {
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import type { Translator } from "intor-translator";
import type * as React from "react";

export interface IntorValue<CK extends GenConfigKeys = "__default__"> {
  config: IntorResolvedConfig;
  locale: GenLocale<CK>;
  messages?: Readonly<GenMessages<CK>>;
  isLoading?: boolean;
  onLocaleChange?: (newLocale: GenLocale<CK>) => Promise<void> | void;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
}

export interface IntorProviderProps<CK extends GenConfigKeys = "__default__"> {
  value: IntorValue<CK>;
  children: React.ReactNode;
}

export type IntorContextValue<CK extends GenConfigKeys = "__default__"> = {
  config: IntorResolvedConfig;
  locale: GenLocale<CK>;
  setLocale: (locale: GenLocale<CK>) => void;
  translator: Translator<unknown>;
};
