import type { LogLevel } from "./intor-logger-types";

export const LOG_LEVELS = ["silent", "error", "warn", "info", "debug"] as const;

export const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

export const LEVEL_COLOR_CODE: Record<Exclude<LogLevel, "silent">, string> = {
  error: "9",
  warn: "214",
  info: "34",
  debug: "33",
};

export const DEFAULT_LOG_LEVEL = "warn";
export const DEFAULT_META_DEPTH = 2;
export const DEFAULT_BORDER_WIDTH = 0;
export const DEFAULT_IS_USE_COLOR = true;
