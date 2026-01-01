import type { CacheResolvedOptions, LoggerOptions } from "@/config";
import type { MessagesPool, MessagesReadOptions } from "@/core";

export interface LoadLocalMessagesParams {
  // --- Messages Scope ---
  locale: string;
  fallbackLocales?: string[];
  namespaces?: string[];
  rootDir?: string;

  // --- Local Execution ---
  concurrency?: number;

  // --- Read Behavior ---
  readOptions?: MessagesReadOptions;

  // --- Caching ---
  pool?: MessagesPool;
  cacheOptions: CacheResolvedOptions; // per-config policy
  allowCacheWrite?: boolean; // per-call permission

  // --- Observability ---
  loggerOptions: LoggerOptions;
}
