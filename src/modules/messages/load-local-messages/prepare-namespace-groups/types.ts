import type { LoggerOptions } from "@/modules/config/types/logger.types";
import type { LimitFunction } from "p-limit";

export type NamespaceGroupValue = { isAtRoot: boolean; filePaths: string[] };

export type PrepareNamespaceGroupsOptions = {
  basePath: string;
  namespaces?: Set<string>; // If not provided, all files will be scanned.
  limit: LimitFunction;
  logger?: LoggerOptions & { id: string };
};
