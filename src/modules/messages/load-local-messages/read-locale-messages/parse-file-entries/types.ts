import type { LoggerOptions } from "@/modules/config/types/logger.types";
import type { FileEntry } from "@/modules/messages/load-local-messages/read-locale-messages/types";
import type { MessagesReader, Messages } from "@/modules/messages/shared/types";
import type { LimitFunction } from "p-limit";

export interface ParseFileEntriesOptions {
  fileEntries: FileEntry[];
  limit: LimitFunction;
  extraOptions?: {
    loggerOptions?: LoggerOptions & { id?: string };
    messagesReader?: MessagesReader;
  };
}

export interface ParsedFileEntries {
  namespace: string;
  messages: Messages;
}
