import type { RemoteHeaders, LoggerOptions } from "@/config";

export interface LoadRemoteMessagesParams {
  // --- Messages Scope ---
  locale: string;
  fallbackLocales?: string[];
  namespaces?: string[];
  rootDir?: string;

  // --- Remote Source ---
  url: string;
  headers?: RemoteHeaders;
  signal?: AbortSignal; // abort signal for canceling in-flight remote requests

  // --- Observability ---
  loggerOptions: LoggerOptions;
}
