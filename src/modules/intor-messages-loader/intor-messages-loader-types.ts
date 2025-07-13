import { Locale, LocaleNamespaceMessages } from "intor-translator";
import { IntorResolvedConfig } from "@/modules/intor-config/types/define-intor-config-types";

export type IntorMessagesOptions = {
  config: IntorResolvedConfig;
  locale: Locale;
  pathname: string;
};

export type IntorMessagesResult = Promise<LocaleNamespaceMessages | undefined>;
