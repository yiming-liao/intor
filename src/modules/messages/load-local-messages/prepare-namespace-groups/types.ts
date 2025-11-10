import type pLimit from "p-limit";
import { LoggerOptions } from "@/modules/config/types/logger.types";

export type NamespaceGroupValue = { isAtRoot: boolean; filePaths: string[] };

export type PrepareNamespaceGroupsOptions = {
  basePath: string;
  namespaces?: Set<string>; // If not provided, all files will be scanned.
  limit: ReturnType<typeof pLimit>;
  logger?: LoggerOptions & { id: string };
};
