import { Locale, LocaleNamespaceMessages } from "intor-translator";
import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";

export type MessagesLoaderOptions = {
  config: IntorResolvedConfig;
  locale: Locale;
  pathname: string;
};

export type MessagesLoaderResult = Promise<LocaleNamespaceMessages | undefined>;
