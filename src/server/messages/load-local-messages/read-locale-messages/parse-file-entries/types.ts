import type { FileEntry } from "../types";
import type { LoggerOptions } from "@/config";
import type { MessagesReader, Messages } from "@/core";
import type { LimitFunction } from "p-limit";

export interface ParseFileEntriesParams {
  fileEntries: FileEntry[];
  limit: LimitFunction;
  messagesReader?: MessagesReader;
  loggerOptions: LoggerOptions;
}

export interface ParsedFileEntries {
  namespace: string;
  messages: Messages;
}
