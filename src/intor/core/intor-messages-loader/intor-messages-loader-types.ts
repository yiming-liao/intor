import type {
  Locale,
  LocaleNamespaceMessages,
} from "../../types/message-structure-types";
import type { IntorResolvedConfig } from "../intor-config/types/define-intor-config-types";

export type IntorMessagesOptions = {
  config: IntorResolvedConfig;
  locale: Locale;
  pathname: string;
};

export type IntorMessagesResult = Promise<LocaleNamespaceMessages | undefined>;
