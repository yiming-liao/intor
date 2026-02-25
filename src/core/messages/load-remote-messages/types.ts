import type { RemoteHeaders, LoggerOptions } from "../../../config";
import type { RuntimeFetch } from "../../types";
import type { Locale } from "intor-translator";

export interface LoadRemoteMessagesParams {
  // --- Messages Scope ---
  locale: Locale;
  fallbackLocales?: Locale[];
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
