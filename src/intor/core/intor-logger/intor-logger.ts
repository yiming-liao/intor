export type LogLevel = "silent" | "error" | "warn" | "info" | "debug";

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

const LEVEL_COLOR_CODE: Record<LogLevel, string> = {
  silent: "8",
  error: "9",
  warn: "214",
  info: "34",
  debug: "33",
};

/**
 * Minimal logger with level, id, and prefix.
 */
export class IntorLogger {
  private level: LogLevel;
  private id: string;
  private prefix: string;

  /**
   * Create a logger.
   * @param level Log level (default: "warn")
   * @param id Logger ID (default: "undefined")
   * @param prefix Optional prefix, usually set as the file name.
   */
  constructor(level: LogLevel = "warn", id = "undefined", prefix = "") {
    this.level = level;
    this.id = id;
    this.prefix = prefix;
  }

  /** Set logger ID. */
  setId(id: string) {
    this.id = id;
  }

  /** Set log prefix. */
  setLogPrefix(prefix: string) {
    this.prefix = prefix;
  }

  /** Get current log level. */
  getLevel(): LogLevel {
    return this.level;
  }

  /** Set log level. */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /** Check if message should be logged. */
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] <= LOG_LEVEL_PRIORITY[this.level];
  }

  /**
   * Log a message.
   * @param level Log level
   * @param message Text message
   * @param meta Optional meta data
   */
  log(level: LogLevel, message: string, meta?: unknown): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const levelTag = `[${level.toUpperCase()}]`;
    const idTag = `[${this.id}]`;
    const prefixTag = this.prefix ? `[${this.prefix}] ` : "";
    const colorCode = LEVEL_COLOR_CODE[level];

    const formatted =
      `[${timestamp}] ` +
      `\x1b[38;5;${colorCode}m${levelTag}\x1b[0m ` +
      `\x1b[38;5;245m${idTag}\x1b[0m ` +
      `${prefixTag}${message}`;

    console.log(formatted, ...(meta !== undefined ? [meta] : []));
  }

  /** Debug log. */
  debug(message: string, meta?: unknown) {
    this.log("debug", message, meta);
  }

  /** Info log. */
  info(message: string, meta?: unknown) {
    this.log("info", message, meta);
  }

  /** Warn log. */
  warn(message: string, meta?: unknown) {
    this.log("warn", message, meta);
  }

  /** Error log. */
  error(message: string, meta?: unknown) {
    this.log("error", message, meta);
  }
}
