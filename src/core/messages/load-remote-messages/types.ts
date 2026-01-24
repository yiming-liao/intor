import type { RuntimeFetch } from "../../types";
import type { RemoteHeaders, LoggerOptions } from "@/config";

export interface LoadRemoteMessagesParams {
  // --- Messages Scope ---
  locale: string;
  fallbackLocales?: string[];
  namespaces?: string[];

  // --- Execution ---
  concurrency?: number;
  fetch: RuntimeFetch;

  // --- Remote Source ---
  url: string;
  headers?: RemoteHeaders;
  signal?: AbortSignal; // abort signal for canceling in-flight remote requests

  // --- Observability ---
  loggerOptions: LoggerOptions;
}
