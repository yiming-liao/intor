import type { LogLevel } from "@/intor/core/intor-logger/intor-logger";
import { IntorLogger } from "@/intor/core/intor-logger/intor-logger";

// Manage all logger instances
const loggerMap: Record<string, IntorLogger> = {};

/**
 * Generate the corresponding logger instance based on the given id
 * @param id The unique identifier for the logger
 * @param level The log level for the logger (default is 'warn')
 * @returns The corresponding IntorLogger instance
 */
export const getIntorLogger = (
  id: string,
  level: LogLevel = "warn",
): IntorLogger => {
  // If a logger for the given id already exists, return the existing logger
  if (loggerMap[id]) {
    return loggerMap[id];
  }

  // Otherwise, create a new logger instance with a customizable log level
  const newLogger = new IntorLogger(level, id);
  loggerMap[id] = newLogger;
  return newLogger;
};
