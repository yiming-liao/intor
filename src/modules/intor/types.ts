import { Locale, LocaleNamespaceMessages } from "intor-translator";
import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";

// Adapter runtime
export interface AdapterRuntime {
  locale: Locale;
  pathname: string;
}

// Intor options
export interface IntorOptions {
  config: IntorResolvedConfig;
  adapter?: (config: IntorResolvedConfig) => Promise<AdapterRuntime>;
  adapterRuntime?: Partial<AdapterRuntime>;
}

// Intor result
export interface IntorResult {
  config: IntorResolvedConfig;
  initialLocale: Locale;
  pathname: string;
  messages: LocaleNamespaceMessages;
}
