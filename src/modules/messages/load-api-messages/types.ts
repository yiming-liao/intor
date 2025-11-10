import { CacheResolvedOptions } from "@/modules/config/types/cache.types";
import { ApiHeaders, ApiLoader } from "@/modules/config/types/loader.types";
import { LoggerOptions } from "@/modules/config/types/logger.types";

export interface LoadApiMessagesOptions extends Omit<ApiLoader, "type"> {
  locale: string;
  fallbackLocales: string[];
  cache?: CacheResolvedOptions;
  logger?: LoggerOptions & { id: string };
}

export interface FetcherOptions {
  apiUrl: string;
  apiHeaders?: ApiHeaders;
  locale: string;
  searchParams: URLSearchParams;
  logger?: LoggerOptions & { id: string };
}

export interface FetchFallbackMessagesOptions {
  apiUrl: string;
  apiHeaders?: ApiHeaders;
  searchParams: URLSearchParams;
  fallbackLocales: string[];
  logger?: LoggerOptions & { id: string };
}
