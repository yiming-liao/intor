import type { LoggerOptions } from "@/modules/config/types/logger.types";
import type { FileEntry } from "@/modules/messages/load-local-messages/read-locale-messages/types";
import type { NamespaceMessages } from "@/modules/messages/types";
import type { MessageFileReader } from "@/modules/messages/types";
import type { LimitFunction } from "p-limit";

export interface ParseFileEntriesOptions {
  fileEntries: FileEntry[];
  limit: LimitFunction;
  extraOptions?: {
    loggerOptions?: LoggerOptions & { id?: string };
    messageFileReader?: MessageFileReader;
  };
}

export interface ParsedFileEntries {
  namespace: string;
  namespaceMessages: NamespaceMessages;
}
