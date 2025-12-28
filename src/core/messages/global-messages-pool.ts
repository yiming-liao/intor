import type { LocaleMessages } from "intor-translator";
import Keyv from "keyv";

/**
 * Global messages pool (cross-module + hot-reload safe)
 */
export type MessagesPool = Keyv<LocaleMessages>;

declare global {
  var __INTOR_MESSAGES_POOL__: MessagesPool | undefined;
}

export function getGlobalMessagesPool(): MessagesPool {
  if (!globalThis.__INTOR_MESSAGES_POOL__) {
    globalThis.__INTOR_MESSAGES_POOL__ = new Keyv<LocaleMessages>();
  }
  return globalThis.__INTOR_MESSAGES_POOL__;
}

/**
 * Replace the global messages pool.
 *
 * - Intended for advanced usage (e.g. Redis, custom cache backends).
 * - Must be called during application bootstrap.
 */
export function setGlobalMessagesPool(pool: MessagesPool): void {
  globalThis.__INTOR_MESSAGES_POOL__ = pool;
}

/**
 * Optional: clear all cache
 * - Useful in tests or dynamic reloads.
 */
export function clearMessagesPool(): void {
  const pool = getGlobalMessagesPool();
  pool.clear();
}
