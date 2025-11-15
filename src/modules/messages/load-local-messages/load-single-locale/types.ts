import type { LoggerOptions } from "@/modules/config/types/logger.types";
import type { Locale, LocaleMessages } from "intor-translator";
import type pLimit from "p-limit";

export interface LoadSingleLocaleOptions {
  basePath: string;
  locale: Locale;
  namespaces?: string[];
  messages: LocaleMessages;
  limit: ReturnType<typeof pLimit>;
  logger?: LoggerOptions & { id: string };
}
