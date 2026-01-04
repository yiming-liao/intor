import type {
  RemoteHeaders,
  LoggerOptions,
  CacheResolvedOptions,
} from "@/config";
import type { MessagesPool } from "@/core";

export interface LoadRemoteMessagesParams {
  id: string;

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
