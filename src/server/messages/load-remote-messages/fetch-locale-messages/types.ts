import type { RemoteHeaders } from "@/config/types/loader.types";
import type { LoggerOptions } from "@/config/types/logger.types";

export interface FetcherOptions {
  remoteUrl: string;
  remoteHeaders?: RemoteHeaders;
  locale: string;
  searchParams: URLSearchParams;
  extraOptions?: {
    loggerOptions?: LoggerOptions & { id?: string };
  };
}
