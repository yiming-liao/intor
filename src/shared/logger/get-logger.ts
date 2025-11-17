import type { LoggerOptions } from "@/modules/config/types/logger.types";
import type { Logger, FormatterConfig } from "logry";
import { logry } from "logry";
import { getGlobalLoggerPool } from "@/shared/logger/global-logger-pool";

const DEFAULT_FORMATTER_CONFIG: FormatterConfig = {
  node: { meta: { compact: true }, lineBreaksAfter: 1 },
};

/**
 * Get a shared logger instance by id.
 * - Safe across hot reloads
 * - Prevents unbounded memory usage via soft LRU
 */
export function getLogger({
  id = "default",
  formatterConfig,
  preset,
  ...options
}: { id?: string; scope?: string } & LoggerOptions): Logger {
  const pool = getGlobalLoggerPool();

  let logger = pool.get(id);

  const useDefault = !formatterConfig && !preset;

  if (!logger) {
    logger = logry({
      id,
      formatterConfig: useDefault ? DEFAULT_FORMATTER_CONFIG : formatterConfig,
      preset,
      ...options,
    });

    pool.set(id, logger);

    // Soft LRU: keep pool size under control
    if (pool.size > 1000) {
      const keys = [...pool.keys()];
      for (const key of keys.slice(0, 200)) pool.delete(key);
    }
  }

  return logger;
}
