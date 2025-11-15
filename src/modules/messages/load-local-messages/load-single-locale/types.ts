import type pLimit from "p-limit";
import { Locale, LocaleMessages } from "intor-translator";
import { LoggerOptions } from "@/modules/config/types/logger.types";

export interface LoadSingleLocaleOptions {
  basePath: string;
  locale: Locale;
  namespaces?: string[];
  messages: LocaleMessages;
  limit: ReturnType<typeof pLimit>;
  logger?: LoggerOptions & { id: string };
}
