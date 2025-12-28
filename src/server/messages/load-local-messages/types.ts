import type { CacheResolvedOptions } from "@/config/types/cache.types";
import type { LoggerOptions } from "@/config/types/logger.types";
import type { MessagesPool, MessagesReader } from "@/shared/messages";

export interface LoadLocalMessagesParams {
  // --- Messages Scope ---
  locale: string;
  fallbackLocales?: string[];
  namespaces?: string[];
  rootDir?: string;

  // --- Local Execution ---
  concurrency?: number;
  exts?: string[];
  messagesReader?: MessagesReader;

  // --- Caching ---
  pool?: MessagesPool;
  cacheOptions: CacheResolvedOptions; // per-config policy
  allowCacheWrite?: boolean; // per-call permission

  // --- Observability ---
  loggerOptions: LoggerOptions;
}
