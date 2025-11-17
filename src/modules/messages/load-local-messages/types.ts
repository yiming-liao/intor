import type { CacheResolvedOptions } from "@/modules/config/types/cache.types";
import type { LoggerOptions } from "@/modules/config/types/logger.types";
import type { MessagesReader } from "@/modules/messages/shared/types";
import type { MessagesPool } from "@/shared/messages/global-messages-pool";

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
}
