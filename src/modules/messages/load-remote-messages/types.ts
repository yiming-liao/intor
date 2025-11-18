import type { CacheResolvedOptions } from "@/modules/config/types/cache.types";
import type { RemoteHeaders } from "@/modules/config/types/loader.types";
import type { LoggerOptions } from "@/modules/config/types/logger.types";
import type { MessagesPool } from "@/shared/messages/global-messages-pool";

export interface LoadRemoteMessagesOptions {
  pool?: MessagesPool;
  rootDir?: string;
  locale: string;
  fallbackLocales: string[];
  namespaces?: string[];
  remoteUrl: string;
  remoteHeaders?: RemoteHeaders;
  extraOptions?: {
    cacheOptions?: CacheResolvedOptions;
    loggerOptions?: LoggerOptions & { id?: string };
  };
  allowCacheWrite?: boolean;
}
