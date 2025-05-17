import type { WriteLogPayload } from "./weite-log-types";
import {
  DEFAULT_BORDER_WIDTH,
  DEFAULT_IS_USE_COLOR,
  DEFAULT_META_DEPTH,
  LEVEL_COLOR_CODE,
} from "../intor-logger-constants";
import { formatLog } from "./utils/format-log";
import { printMeta } from "./utils/print-meta";

export const writeLog = ({
  id,
  level,
  prefix,
  message,
  meta,
  writeLogOptions,
}: WriteLogPayload): void => {
  const metaDepth = writeLogOptions?.metaDepth ?? DEFAULT_META_DEPTH;
  const borderWidth = writeLogOptions?.borderWidth ?? DEFAULT_BORDER_WIDTH;
  const isUseColor = writeLogOptions?.isUseColor ?? DEFAULT_IS_USE_COLOR;

  // Skip when the level is "silent"
  if (level === "silent") {
    return;
  }

  // Check if level is a valid key in LEVEL_COLOR_CODE
  if (!(level in LEVEL_COLOR_CODE)) {
    throw new Error(`[Intor Logger] Invalid log level: ${level}`);
  }

  // Ensure message and id are both provided
  if (!message || !id) {
    throw new Error("[Intor Logger] Both message and id are required.");
  }

  // Check if borderWidth is a negative value
  if (borderWidth < 0) {
    throw new Error(
      `[Intor Logger] Invalid borderWidth value: ${borderWidth}. It must be a positive number.`,
    );
  }

  const output = formatLog({ id, level, prefix, message, isUseColor });
  const border = "─".repeat(borderWidth);

  // ▼ Printing

  // Header border
  if (borderWidth) {
    console.log(border);
  }

  // Main content
  console.log(output);
  if (meta) {
    printMeta(meta, metaDepth, isUseColor);
  }

  // Footer border
  console.log(border || "\n");

  // FUTURE: Do some async actions like saving logs...
  // await saveLogToDatabase(output);
  // await persistLog({...});
};
