import type pLimit from "p-limit";
import {
  Locale,
  LocaleNamespaceMessages,
  Namespace,
  NestedMessage,
} from "intor-translator";
import { NamespaceGroupValue } from "../prepare-namespace-groups";
import { LoggerOptions } from "@/modules/config/types/logger.types";

export interface LoadNamespaceGroupOptions {
  locale: Locale;
  namespace: Namespace;
  messages: LocaleNamespaceMessages;
  namespaceGroupValue: NamespaceGroupValue;
  limit: ReturnType<typeof pLimit>;
  logger?: LoggerOptions & { id: string };
}

export type StringKeyedMessages = Record<string, NestedMessage>;
