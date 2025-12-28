import type { LoggerOptions } from "@/config";
import type { FormatConfig, Logger, RenderConfig } from "logry";
import { logry } from "logry";
import { getGlobalLoggerPool } from "./global-logger-pool";

const DEFAULT_FORMAT_CONFIG: FormatConfig = {
  timestamp: { withDate: false },
};
const DEFAULT_RENDER_CONFIG: RenderConfig = {
  timestamp: {},
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
  formatConfig,
  renderConfig,
  preset,
  ...options
}: LoggerOptions & { scope?: string }): Logger {
  const pool = getGlobalLoggerPool();

  let logger = pool.get(id);

  if (!logger) {
    logger = logry({
      id,
      formatConfig:
        !formatConfig && !preset ? DEFAULT_FORMAT_CONFIG : formatConfig,
      renderConfig:
        !renderConfig && !preset ? DEFAULT_RENDER_CONFIG : renderConfig,
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
