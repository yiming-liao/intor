import type { LocaleMessages } from "intor-translator";

/**
 * Global messages pool (process-level, hot-reload safe).
 *
 * This pool is intentionally minimal:
 * - No TTL
 * - No eviction
 * - No external backends
 *
 * Messages are treated as immutable within a process lifecycle.
 */
export type MessagesPool = Map<string, LocaleMessages>;

declare global {
  var __INTOR_MESSAGES_POOL__: MessagesPool | undefined;
}

/**
 * Get the global messages pool.
 *
 * Lazily initialized to ensure:
 * - Cross-module sharing
 * - Dev / HMR safety
 */
export function getGlobalMessagesPool(): MessagesPool {
  if (!globalThis.__INTOR_MESSAGES_POOL__) {
    const pool: MessagesPool = new Map();
    globalThis.__INTOR_MESSAGES_POOL__ = pool;
  }
  return globalThis.__INTOR_MESSAGES_POOL__;
}

/** Clear all cached messages. */
export function clearMessagesPool(): void {
  const pool = getGlobalMessagesPool();
  pool.clear();
}
