import type { LoggerOptions } from "@/modules/config/types/logger.types";
import type { NestedMessage } from "intor-translator";
import type pLimit from "p-limit";

export interface LoadLocaleWithFallbackOptions {
  basePath: string;
  locale: string;
  fallbackLocales?: string[];
  namespaces?: string[];
  messages: Record<string, Record<string, NestedMessage>>;
  limit: ReturnType<typeof pLimit>;
  logger?: LoggerOptions & { id: string };
}
