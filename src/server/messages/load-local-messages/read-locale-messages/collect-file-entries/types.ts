import type { LoggerOptions } from "@/config";
import type fs from "node:fs/promises";
import type { LimitFunction } from "p-limit";

export interface CollectFileEntriesParams {
  readdir?: (typeof fs)["readdir"];
  namespaces?: string[];
  rootDir: string;
  limit: LimitFunction;
  extraOptions: {
    exts?: string[];
    loggerOptions: LoggerOptions;
  };
}
