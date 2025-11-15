import type { NamespaceGroupValue } from "../prepare-namespace-groups";
import type { LoggerOptions } from "@/modules/config/types/logger.types";
import type { Locale, LocaleMessages, NestedMessage } from "intor-translator";
import type { LimitFunction } from "p-limit";

export interface LoadNamespaceGroupOptions {
  locale: Locale;
  namespace: string;
  messages: LocaleMessages;
  namespaceGroupValue: NamespaceGroupValue;
  limit: LimitFunction;
  logger?: LoggerOptions & { id: string };
}

export type StringKeyedMessages = Record<string, NestedMessage>;
