import type { LoggerOptions } from "@/modules/config/types/logger.types";
import type { NestedMessage } from "intor-translator";
import type { LimitFunction } from "p-limit";

export interface LoadLocaleWithFallbackOptions {
  basePath: string;
  locale: string;
  fallbackLocales?: string[];
  namespaces?: string[];
  messages: Record<string, Record<string, NestedMessage>>;
  limit: LimitFunction;
  logger?: LoggerOptions & { id: string };
}
