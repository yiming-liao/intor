import { NestedMessage } from "intor-translator";
import pLimit from "p-limit";
import { LoggerOptions } from "@/modules/config/types/logger.types";

export interface LoadLocaleWithFallbackOptions {
  basePath: string;
  locale: string;
  fallbackLocales?: string[];
  namespaces?: string[];
  messages: Record<string, Record<string, NestedMessage>>;
  limit: ReturnType<typeof pLimit>;
  logger?: LoggerOptions & { id: string };
}
