import type { MessagesPool } from "./cache/messages-pool";
import type { LoggerOptions } from "@/config";
import type { MessagesReaders } from "@/core";
import type { Locale } from "intor-translator";

export interface LoadLocalMessagesParams {
  id: string;

  // --- Messages Scope ---
  locale: Locale;
  fallbackLocales?: string[];
  namespaces?: string[];
  rootDir?: string;

  // --- Local Execution ---
  concurrency?: number;

  // --- Read Behavior ---
  readers?: MessagesReaders;

  // --- Caching ---
  pool?: MessagesPool;
  allowCacheWrite?: boolean; // per-call permission

  // --- Observability ---
  loggerOptions: LoggerOptions;
}
