import type { LoggerOptions } from "@/config";
import type { MessagesReadOptions } from "@/core";
import type { LimitFunction } from "p-limit";

export interface FileEntry {
  namespace: string;
  fullPath: string;
  relativePath: string;
  segments: string[];
  basename: string;
}

export interface ReadLocaleMessagesParams {
  locale: string;
  namespaces?: string[];
  rootDir?: string;
  limit: LimitFunction;
  readOptions?: MessagesReadOptions;
  loggerOptions: LoggerOptions;
}
