import type { CacheResolvedOptions } from "@/config/types/cache.types";
import type { RemoteHeaders } from "@/config/types/loader.types";
import type { LoggerOptions } from "@/config/types/logger.types";
import type { MessagesPool } from "@/core/messages/global-messages-pool";

export interface LoadRemoteMessagesParams {
  // --- Messages Scope ---
  locale: string;
  fallbackLocales?: string[];
  namespaces?: string[];
  rootDir?: string;

  // --- Remote Source ---
  url: string;
  headers?: RemoteHeaders;
  signal?: AbortSignal; // abort signal for canceling in-flight remote requests

  // --- Caching ---
  pool?: MessagesPool;
  cacheOptions: CacheResolvedOptions; // per-config policy
  allowCacheWrite?: boolean; // per-call permission

  // --- Observability ---
  loggerOptions: LoggerOptions;
}
