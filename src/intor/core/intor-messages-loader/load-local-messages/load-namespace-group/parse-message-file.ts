import type { IntorLogger } from "../../../..//core/intor-logger/intor-logger";
import type { MessageRecord } from "../../../..//types/message-structure-types";
import path from "node:path";
import { readMessageRecordFile } from "../utils/read-message-record-file";

const MAX_PATH_LENGTH = 260;

/**
 * Parses a local JSON message file into a MessageRecord.
 *
 * @param filePath - Absolute or relative path to the message JSON file.
 * @param logger - Optional logger instance for debugging and error tracking.
 * @returns Parsed MessageRecord or null if file is invalid or cannot be read.
 */
export const parseMessageFile = async (
  filePath: string,
  baseLogger?: IntorLogger,
): Promise<MessageRecord | null> => {
  const logger = baseLogger?.child({ prefix: "parseMessageFile" });
  const trimmedPath = filePath.trim();

  if (!trimmedPath) {
    void logger?.warn("Invalid file path provided.", { filePath: trimmedPath });
    return null;
  }

  if (trimmedPath.length > MAX_PATH_LENGTH) {
    void logger?.warn("Invalid file path provided.", { filePath: trimmedPath });
    return null;
  }

  const fileName = path.basename(trimmedPath);

  if (!fileName.toLowerCase().endsWith(".json")) {
    void logger?.debug(`Skipped non-JSON file.`, { filePath: trimmedPath });
    return null;
  }

  try {
    const { content } = await readMessageRecordFile(trimmedPath);
    void logger?.debug(`Loaded a file.`, { filePath: trimmedPath });
    return content;
  } catch (error) {
    void logger?.warn(`Failed to load file.`, { filePath: trimmedPath, error });
    return null;
  }
};
