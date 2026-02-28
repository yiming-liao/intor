import type { LoggerOptions } from "../../config";
import type { FormatConfig, Logger, RenderConfig } from "logry";
import { logry } from "logry";
import { getGlobalLoggerPool } from "./global-logger-pool";

const DEFAULT_FORMAT_CONFIG: FormatConfig = {
  timestamp: { withDate: false },
};
const DEFAULT_RENDER_CONFIG: RenderConfig = {
  id: { visible: true, prefix: "<", suffix: ">" },
  meta: { lineBreaksAfter: 1 },
};

/**
 * Get a shared logger instance by id.
 * - Safe across hot reloads
 * - Prevents unbounded memory usage via soft LRU
 */
export function getLogger({
  id = "default",
  preset,
  ...options
}: LoggerOptions): Logger {
  const pool = getGlobalLoggerPool();

  const existing = pool.get(id);
  if (existing) return existing;

  const baseConfig =
    preset === undefined
      ? {
          formatConfig: DEFAULT_FORMAT_CONFIG,
          renderConfig: DEFAULT_RENDER_CONFIG,
        }
      : { preset };

  const logger = logry({
    id,
    ...baseConfig,
    ...options,
  });

  pool.set(id, logger);

  // Soft LRU: keep pool size under control
  if (pool.size > 1000) {
    for (const key of [...pool.keys()].slice(0, 200)) {
      pool.delete(key);
    }
  }

  return logger;
}
