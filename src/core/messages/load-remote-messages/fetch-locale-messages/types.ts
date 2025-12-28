import type { RemoteHeaders } from "@/config/types/loader.types";
import type { LoggerOptions } from "@/config/types/logger.types";

export interface FetcherOptions {
  locale: string;
  namespaces?: string[];
  rootDir?: string;
  url: string;
  headers?: RemoteHeaders;
  signal?: AbortSignal;
  extraOptions: {
    loggerOptions: LoggerOptions;
  };
}
