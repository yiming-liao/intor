import type { LoggerOptions } from "@/modules/config/types/logger.types";
import type { MessageFileReader } from "@/modules/messages/shared/types";
import type { LimitFunction } from "p-limit";

export interface FileEntry {
  namespace: string;
  fullPath: string;
  relativePath: string;
  segments: string[];
  basename: string;
}

export interface ReadLocaleMessagesOptions {
  limit: LimitFunction;
  rootDir?: string;
  locale: string;
  namespaces?: string[];
  extraOptions?: {
    loggerOptions?: LoggerOptions & { id?: string };
    exts?: string[];
    messageFileReader?: MessageFileReader;
  };
}
