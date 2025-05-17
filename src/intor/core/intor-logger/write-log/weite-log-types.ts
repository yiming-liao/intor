import type { LogLevel } from "../intor-logger-types";

export type LogMeta =
  | Record<string, unknown>
  | ({ error: Error } & Record<string, unknown>)
  | Error
  | string
  | number
  | boolean
  | null
  | undefined
  | unknown;

export type WriteLogOptions = {
  metaDepth?: number;
  borderWidth?: number;
  isUseColor?: boolean;
};

export type WriteLogPayload = {
  id: string;
  level: LogLevel;
  prefix?: string;
  message: string;
  meta?: LogMeta;
  writeLogOptions?: WriteLogOptions;
};
