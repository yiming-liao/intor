import type { LogLevel } from "./intor-logger-types";
import type { LogMeta } from "./write-log";
import type { WriteLogOptions } from "./write-log/weite-log-types";
import { LOG_LEVEL_PRIORITY } from "./intor-logger-constants";
import { IntorLoggerCore } from "./intor-logger-core/intor-logger-core";
import { writeLog } from "./write-log/write-log";

type LogOptions = {
  prefix?: string;
  writeLogOptions?: WriteLogOptions;
};

/**
 * A logger class that handles logging at different levels and supports child loggers.
 * It also ensures that logs are written only if they meet the required level priority.
 */
export class IntorLogger {
  private readonly level: LogLevel;
  private readonly prefix?: string;
  private readonly writeLogOptions?: WriteLogOptions;

  constructor(
    private readonly core: IntorLoggerCore,
    level?: LogLevel,
    prefix?: string,
    writeLogOptions?: WriteLogOptions,
  ) {
    this.level = level ?? core.level;
    this.prefix = prefix;
    this.writeLogOptions = writeLogOptions;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] <= LOG_LEVEL_PRIORITY[this.level];
  }

  private createLogger(
    level: LogLevel,
    prefix?: string,
    writeLogOptions?: WriteLogOptions,
  ): IntorLogger {
    return new IntorLogger(this.core, level, prefix, writeLogOptions);
  }

  child(params?: {
    level?: LogLevel;
    prefix?: string;
    writeLogOptions?: WriteLogOptions;
  }): IntorLogger {
    const {
      level = this.level,
      prefix = this.prefix,
      writeLogOptions = this.writeLogOptions,
    } = params || {};

    return this.createLogger(level, prefix, writeLogOptions);
  }

  async log(
    level: LogLevel,
    message: string,
    meta?: LogMeta,
    options?: LogOptions,
  ) {
    IntorLoggerCore.assertValidLevel(level);
    if (this.shouldLog(level)) {
      await writeLog({
        level,
        id: this.core.id,
        prefix: options?.prefix || this.prefix,
        message,
        meta,
        writeLogOptions: {
          ...this.core.writeLogOptions,
          ...this.writeLogOptions,
          ...options?.writeLogOptions,
        },
      });
    }
  }

  private logWithLevel(level: LogLevel) {
    return async (msg: string, meta?: LogMeta, options?: LogOptions) => {
      await this.log(level, msg, meta, options);
    };
  }

  debug = this.logWithLevel("debug");
  info = this.logWithLevel("info");
  warn = this.logWithLevel("warn");
  error = this.logWithLevel("error");
}
