import { LocaleNamespaceMessages } from "intor-translator";
import Keyv from "keyv";

/**
 * Global messages pool (cross-module + hot-reload safe)
 */
export type MessagesPool = Keyv<LocaleNamespaceMessages>;

declare global {
  var __INTOR_MESSAGES_POOL__: MessagesPool | undefined;
}

export function getGlobalMessagesPool(): MessagesPool {
  if (!globalThis.__INTOR_MESSAGES_POOL__) {
    globalThis.__INTOR_MESSAGES_POOL__ = new Keyv<LocaleNamespaceMessages>();
  }
  return globalThis.__INTOR_MESSAGES_POOL__;
}

/**
 * Optional: clear all cache
 * Useful in tests or dynamic reloads.
 */
export function clearMessagesPool(): void {
  const pool = getGlobalMessagesPool();
  pool.clear();
}
