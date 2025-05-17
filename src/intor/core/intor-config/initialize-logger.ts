import type { InitLoggerOptions } from "./types/logger-options-types";
import type { IntorLogger } from "../../core/intor-logger";
import { DEFAULT_LOGGER_OPTIONS } from "../../constants/logger-options-constants";
import { getOrCreateLogger } from "../../core/intor-logger";

type InitializeLoggerOptions = {
  id: string;
  loggerOptions?: InitLoggerOptions;
  prefix: string;
};

/**
 * Initialize a logger instance with the given options.
 * If no options are provided, default values will be used.
 *
 * @param {Object} options - The logger initialization options.
 * @param {string} options.id - The unique identifier for the logger.
 * @param {InitLoggerOptions} [options.loggerOptions] - Custom logger settings.
 * @param {string} options.prefix - The prefix to be used in the logger.
 *
 * @returns {IntorLogger} The initialized IntorLogger instance.
 */
export const initializeLogger = ({
  id,
  loggerOptions,
  prefix,
}: InitializeLoggerOptions): IntorLogger => {
  const writeLogOptions = {
    metaDepth: loggerOptions?.metaDepth ?? DEFAULT_LOGGER_OPTIONS.metaDepth,
    borderWidth:
      loggerOptions?.borderWidth ?? DEFAULT_LOGGER_OPTIONS.borderWidth,
    isUseColor: loggerOptions?.isUseColor ?? DEFAULT_LOGGER_OPTIONS.isUseColor,
  };

  const logger = getOrCreateLogger({
    id,
    level: loggerOptions?.level || DEFAULT_LOGGER_OPTIONS.level,
    prefix,
    writeLogOptions,
  });

  return logger;
};
