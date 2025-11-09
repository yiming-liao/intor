import { ApiLoader } from "@/modules/config/types/loader.types";

export interface LoadApiMessagesOptions extends Omit<ApiLoader, "type"> {
  locale: string;
  fallbackLocales: string[];
  configId: string;
}

export interface FetcherOptions {
  apiUrl: string;
  locale: string;
  searchParams: URLSearchParams;
  configId: string;
}

export interface FetchFallbackMessagesOptions {
  apiUrl: string;
  searchParams: URLSearchParams;
  fallbackLocales: string[];
  configId: string;
}
