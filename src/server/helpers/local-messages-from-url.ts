import type { CacheResolvedOptions } from "@/config/types/cache.types";
import type { LoggerOptions } from "@/config/types/logger.types";
import type { MessagesPool } from "@/core/messages";
import type { MessagesReader } from "@/core/messages/types";
import { loadLocalMessages } from "@/server/messages/load-local-messages";

/** Parse a multi-value query parameter into a normalized string array. */
function parseMultiValueParam(values: string[] | null): string[] | undefined {
  if (!values || values.length === 0) return undefined;
  const result = values.flatMap((value) =>
    value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean),
  );
  return result.length > 0 ? result : undefined;
}

export interface LoadMessagesFromUrlOptiosn {
  // --- Local Execution ---
  concurrency?: number;
  exts?: string[];
  messagesReader?: MessagesReader;
  // --- Caching ---
  pool?: MessagesPool;
  cacheOptions?: CacheResolvedOptions;
  allowCacheWrite?: boolean; // per-call permission
  // --- Observability ---
  loggerOptions?: LoggerOptions;
}

/**
 * Load locale messages from a URL-based query protocol.
 *
 * - This helper is intended for building custom HTTP endpoints
 *
 * @example
 * ```ts
 * const url = new URL(
 *   "https://example.com/messages" +
 *   "?locale=en-US" +
 *   "&rootDir=./messages" +
 *   "&namespaces=common" +
 *   "&namespaces=homepage" +
 *   "&fallbackLocales=zh-TW"
 * );
 *
 * const messages = await loadMessagesFromUrl(url);
 * ```
 */
export async function loadMessagesFromUrl(
  url: URL,
  options?: LoadMessagesFromUrlOptiosn,
) {
  // Parse query parameters
  const rootDir = url.searchParams.get("rootDir") ?? "";
  const locale = url.searchParams.get("locale") ?? "en-US";
  const namespaces = parseMultiValueParam(
    url.searchParams.getAll("namespaces"),
  );
  const fallbackLocales = parseMultiValueParam(
    url.searchParams.getAll("fallbackLocales"),
  );

  // Load local messages
  return loadLocalMessages({
    rootDir,
    locale,
    namespaces,
    fallbackLocales,
    concurrency: options?.concurrency,
    exts: options?.exts,
    messagesReader: options?.messagesReader,
    pool: options?.pool,
    cacheOptions: options?.cacheOptions || { enabled: false, ttl: 0 },
    allowCacheWrite: options?.allowCacheWrite,
    loggerOptions: options?.loggerOptions || { id: "default" },
  });
}
