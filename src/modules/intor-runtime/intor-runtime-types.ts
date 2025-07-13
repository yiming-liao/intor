import { Locale, LocaleNamespaceMessages } from "intor-translator";
import { IntorResolvedConfig } from "@/modules/intor-config/types/define-intor-config-types";

export type IntorRuntimeOptions = {
  request?: unknown; // NextServer, express, ...
  config: IntorResolvedConfig;
};

export type IntorRuntimeResult = {
  config: IntorResolvedConfig;
  initialLocale: Locale;
  pathname: string;
  messages: LocaleNamespaceMessages;
};
