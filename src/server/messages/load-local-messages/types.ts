import type { CacheResolvedOptions } from "@/config/types/cache.types";
import type { LoggerOptions } from "@/config/types/logger.types";
import type { MessagesPool } from "@/server/messages/shared/global-messages-pool";
import type { MessagesReader } from "@/server/messages/shared/types";

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
