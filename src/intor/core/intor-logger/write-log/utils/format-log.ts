import type { LogLevel } from "../../intor-logger-types";
import { LEVEL_COLOR_CODE } from "../../intor-logger-constants";
import { formatTimestamp } from "./format-timestamp";

type FormatLogOptions = {
  id: string;
  level: Exclude<LogLevel, "silent">;
  prefix?: string;
  message: string;
  isUseColor?: boolean;
  timeZone?: string;
  date?: Date;
};

const DEFAULT_LEVEL_COLOR_CODE = 15;

export const formatLog = ({
  id,
  level,
  prefix,
  message,
  isUseColor = true,
  timeZone,
  date,
}: FormatLogOptions): string => {
  const timestamp = formatTimestamp(timeZone, date);
  const timestampTag = `[${timestamp}]`;
  const idTag = `[${id}]`;
  const levelTag = `[${level.toUpperCase()}]`.padEnd(7);
  const prefixTag = prefix ? `(${prefix}) ` : "";

  const output =
    `${timestampTag} ` +
    `${idTag} ` +
    `${levelTag} ` +
    `${prefixTag}` +
    `\n` +
    ` • ${message}`;

  if (!isUseColor) {
    return output;
  }

  const colorCode = LEVEL_COLOR_CODE[level] ?? DEFAULT_LEVEL_COLOR_CODE;

  return (
    `\x1b[38;5;245m${timestampTag}\x1b[0m ` +
    `${idTag} ` +
    `\x1b[38;5;${colorCode}m${levelTag}\x1b[0m ` +
    `\x1b[38;5;245m${prefixTag}\x1b[0m` +
    `\n` +
    ` • ${message}`
  );
};
