import type pLimit from "p-limit";
import { Locale, LocaleNamespaceMessages, Namespace } from "intor-translator";
import { LoggerOptions } from "@/modules/config/types/logger.types";

export interface LoadSingleLocaleOptions {
  basePath: string;
  locale: Locale;
  namespaces?: Namespace[];
  messages: LocaleNamespaceMessages;
  limit: ReturnType<typeof pLimit>;
  logger?: LoggerOptions & { id: string };
}
