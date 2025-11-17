import type { RemoteHeaders } from "@/modules/config/types/loader.types";
import type { LoggerOptions } from "@/modules/config/types/logger.types";

export interface FetcherOptions {
  remoteUrl: string;
  remoteHeaders?: RemoteHeaders;
  locale: string;
  searchParams: URLSearchParams;
  extraOptions?: {
    loggerOptions?: LoggerOptions & { id?: string };
  };
}
