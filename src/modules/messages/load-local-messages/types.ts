import { CacheResolvedOptions } from "@/modules/config/types/cache.types";
import { LoggerOptions } from "@/modules/config/types/logger.types";

export interface LoadLocalMessagesOptions {
  basePath?: string | null;
  locale?: string | null;
  fallbackLocales?: string[];
  namespaces?: string[];
  concurrency?: number;
  cache?: CacheResolvedOptions;
  logger?: LoggerOptions & { id: string };
}
