import type { RemoteHeaders, LoggerOptions } from "@/config";

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
