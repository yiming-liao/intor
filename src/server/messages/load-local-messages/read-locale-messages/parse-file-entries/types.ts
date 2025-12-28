import type { LoggerOptions } from "@/config/types/logger.types";
import type { MessagesReader, Messages } from "@/core/messages/types";
import type { FileEntry } from "@/server/messages/load-local-messages/read-locale-messages/types";
import type { LimitFunction } from "p-limit";

export interface ParseFileEntriesParams {
  fileEntries: FileEntry[];
  limit: LimitFunction;
  extraOptions: {
    messagesReader?: MessagesReader;
    loggerOptions: LoggerOptions;
  };
}

export interface ParsedFileEntries {
  namespace: string;
  messages: Messages;
}
