import type { FileEntry } from "../types";
import type { LoggerOptions } from "@/config";
import type { MessagesReaders } from "@/core";
import type { MessageObject } from "intor-translator";
import type { LimitFunction } from "p-limit";

export interface ParseFileEntriesParams {
  fileEntries: FileEntry[];
  limit: LimitFunction;
  readers?: MessagesReaders;
  loggerOptions: LoggerOptions;
}

export interface ParsedFileEntries {
  namespace: string;
  messages: MessageObject;
}
