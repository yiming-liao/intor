import type { CacheResolvedOptions } from "@/config/types/cache.types";
import type { LoggerOptions } from "@/config/types/logger.types";
import type { MessagesReader } from "@/server/messages/shared/types";
import type { MessagesPool } from "@/server/shared/messages/global-messages-pool";

export interface LoadLocalMessagesOptions {
  pool?: MessagesPool;
  rootDir?: string;
  locale: string;
  fallbackLocales?: string[];
  namespaces?: string[];
  extraOptions?: {
    concurrency?: number;
    cacheOptions?: CacheResolvedOptions;
    loggerOptions?: LoggerOptions & { id?: string };
    exts?: string[];
    messagesReader?: MessagesReader;
  };
  allowCacheWrite?: boolean;
}
