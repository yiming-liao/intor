import type { LocaleMessages } from "intor-translator";

/**
 * Messages pool (process-level, hot-reload safe).
 */
export type MessagesPool = Map<string, LocaleMessages>;

declare global {
  var __INTOR_MESSAGES_POOL__: MessagesPool | undefined;
}

/**
 * Get the messages pool.
 */
export function getMessagesPool(): MessagesPool {
  if (!globalThis.__INTOR_MESSAGES_POOL__) {
    globalThis.__INTOR_MESSAGES_POOL__ = new Map();
  }
  return globalThis.__INTOR_MESSAGES_POOL__;
}

/**
 * Clear all cached messages.
 */
export function clearMessagesPool(): void {
  getMessagesPool().clear();
}
