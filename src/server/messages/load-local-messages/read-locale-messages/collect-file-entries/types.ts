import type { LoggerOptions } from "@/config/types/logger.types";
import type fs from "node:fs/promises";
import type { LimitFunction } from "p-limit";

export interface CollectFileEntriesParams {
  readdir?: (typeof fs)["readdir"];
  limit: LimitFunction;
  rootDir: string;
  namespaces?: string[];
  extraOptions?: {
    exts?: string[];
    loggerOptions?: LoggerOptions & { id?: string };
  };
}
