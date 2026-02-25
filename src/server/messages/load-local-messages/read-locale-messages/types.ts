import type { LoggerOptions } from "../../../../config";
import type { MessagesReaders } from "../../../../core";
import type { Locale } from "intor-translator";
import type { LimitFunction } from "p-limit";

export interface FileEntry {
  namespace: string;
  fullPath: string;
  relativePath: string;
  segments: string[];
  basename: string;
}

export interface ReadLocaleMessagesParams {
  locale: Locale;
  namespaces?: string[];
  rootDir?: string;
  limit: LimitFunction;
  readers?: MessagesReaders;
  loggerOptions: LoggerOptions;
}
