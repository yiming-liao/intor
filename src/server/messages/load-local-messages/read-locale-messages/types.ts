import type { LoggerOptions } from "@/config/types/logger.types";
import type { MessagesReader } from "@/shared/messages/types";
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
  extraOptions: {
    exts?: string[];
    messagesReader?: MessagesReader;
    loggerOptions: LoggerOptions;
  };
}
