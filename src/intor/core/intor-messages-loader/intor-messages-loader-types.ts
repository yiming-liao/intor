import type { IntorResolvedConfig } from "../intor-config/types/define-intor-config-types";
import type {
  Locale,
  LocaleNamespaceMessages,
} from "../../types/message-structure-types";

export type IntorMessagesOptions = {
  config: IntorResolvedConfig;
  locale: Locale;
  pathname: string;
};

export type IntorMessagesResult = Promise<LocaleNamespaceMessages | undefined>;
