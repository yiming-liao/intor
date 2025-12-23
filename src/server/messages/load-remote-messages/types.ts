import type { CacheResolvedOptions } from "@/config/types/cache.types";
import type { RemoteHeaders } from "@/config/types/loader.types";
import type { LoggerOptions } from "@/config/types/logger.types";
import type { MessagesPool } from "@/server/shared/messages/global-messages-pool";

export interface LoadRemoteMessagesParams {
  pool?: MessagesPool;
  rootDir?: string;
  locale: string;
  fallbackLocales?: string[];
  namespaces?: string[];
  remoteUrl: string;
  remoteHeaders?: RemoteHeaders;
  extraOptions?: {
    cacheOptions?: CacheResolvedOptions;
    loggerOptions?: LoggerOptions & { id?: string };
  };
  allowCacheWrite?: boolean;
  signal?: AbortSignal;
}
