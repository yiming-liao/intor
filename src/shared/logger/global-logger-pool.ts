import { Logger } from "logry";

/**
 * Global logger pool (cross-module + hot-reload safe)
 */
type LoggerPool = Map<string, Logger>;

declare global {
  var __INTOR_LOGGER_POOL__: LoggerPool | undefined;
}

export function getGlobalLoggerPool(): LoggerPool {
  if (!globalThis.__INTOR_LOGGER_POOL__) {
    globalThis.__INTOR_LOGGER_POOL__ = new Map<string, Logger>();
  }
  return globalThis.__INTOR_LOGGER_POOL__;
}

/**
 * Optional: clear all cache
 * Useful in tests or dynamic reloads.
 */
export function clearLoggerPool(): void {
  const pool = getGlobalLoggerPool();
  pool.clear();
}
