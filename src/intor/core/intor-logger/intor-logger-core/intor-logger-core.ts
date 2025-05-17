import type { LogLevel } from "../intor-logger-types";
import type { WriteLogOptions } from "../write-log/weite-log-types";
import {
  DEFAULT_LOG_LEVEL,
  LOG_LEVEL_PRIORITY,
} from "../intor-logger-constants";

/**
 * The core logger class that handles logging level management and log level validation.
 * This class is used to define the logging level and handle the logging logic for a given logger instance.
 */
export class IntorLoggerCore {
  public level: LogLevel;
  private readonly initialLevel: LogLevel;
  public readonly writeLogOptions?: WriteLogOptions;

  constructor(
    public readonly id: string,
    level: LogLevel = DEFAULT_LOG_LEVEL,
    writeLogOptions?: WriteLogOptions,
  ) {
    IntorLoggerCore.assertValidLevel(level);
    this.level = level;
    this.initialLevel = level;
    this.writeLogOptions = writeLogOptions;
  }

  setLevel(level: LogLevel) {
    IntorLoggerCore.assertValidLevel(level);
    this.level = level;
  }

  resetLevel() {
    this.level = this.initialLevel;
  }

  shouldLog(level: LogLevel): boolean {
    IntorLoggerCore.assertValidLevel(level);
    return LOG_LEVEL_PRIORITY[level] <= LOG_LEVEL_PRIORITY[this.level];
  }

  static assertValidLevel(level: LogLevel): void {
    if (!(level in LOG_LEVEL_PRIORITY)) {
      throw new Error(`Invalid log level: ${level}`);
    }
  }
}
