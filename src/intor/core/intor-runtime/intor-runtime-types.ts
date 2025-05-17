import type { IntorResolvedConfig } from "../../core/intor-config/types/define-intor-config-types";
import type {
  Locale,
  LocaleNamespaceMessages,
} from "../../types/message-structure-types";

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
