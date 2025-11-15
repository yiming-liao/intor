import type { NamespaceGroupValue } from "../prepare-namespace-groups";
import type { LoggerOptions } from "@/modules/config/types/logger.types";
import type { Locale, LocaleMessages, NestedMessage } from "intor-translator";
import type pLimit from "p-limit";

export interface LoadNamespaceGroupOptions {
  locale: Locale;
  namespace: string;
  messages: LocaleMessages;
  namespaceGroupValue: NamespaceGroupValue;
  limit: ReturnType<typeof pLimit>;
  logger?: LoggerOptions & { id: string };
}

export type StringKeyedMessages = Record<string, NestedMessage>;
