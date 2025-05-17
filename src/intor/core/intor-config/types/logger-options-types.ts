import type { LogLevel } from "../../../core/intor-logger/intor-logger-types";

// Init logger options
export type InitLoggerOptions = {
  level?: LogLevel;
  metaDepth?: number;
  borderWidth?: number;
  isUseColor?: boolean;
};

export type ResolvedLoggerOptions = Required<InitLoggerOptions>;
