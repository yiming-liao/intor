import type { LogLevel } from "../intor-logger-types";
import type { WriteLogOptions } from "../write-log/weite-log-types";
import { IntorLogger } from "../intor-logger";
import { DEFAULT_LOG_LEVEL } from "../intor-logger-constants";
import { IntorLoggerCore } from "../intor-logger-core/intor-logger-core";
import { intorLoggerCoreMap } from "../intor-logger-factory/intor-logger-core-map";

/**
 * Retrieves an existing logger by its ID or creates a new one.
 *
 * @param id - The unique identifier for the logger instance.
 * @param level - The log level to set for the logger. If not provided, defaults to `DEFAULT_LOG_LEVEL`.
 * @param prefix - An optional prefix to be included in log messages.
 * @param writeLogOptions - Optional options for log writing configuration.
 * @returns An instance of `IntorLogger` associated with the given ID.
 */
export const getOrCreateLogger = ({
  id,
  level,
  prefix,
  writeLogOptions,
}: {
  id: string;
  level?: LogLevel;
  prefix?: string;
  writeLogOptions?: WriteLogOptions;
}): IntorLogger => {
  // Check if the logger core exists, if not, create a new one.
  if (!intorLoggerCoreMap.has(id)) {
    intorLoggerCoreMap.set(
      id,
      new IntorLoggerCore(id, level || DEFAULT_LOG_LEVEL, writeLogOptions),
    );
  }

  const core = intorLoggerCoreMap.get(id);

  // This block should never happen due to the map check, but for safety, let's throw an error.
  if (!core) {
    throw new Error(`Logger core with ID '${id}' could not be found.`);
  }

  // If a level is provided, update the core logger's level.
  if (level) {
    core.setLevel(level);
  }

  return new IntorLogger(core, level, prefix, writeLogOptions);
};
