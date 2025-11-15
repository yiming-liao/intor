import type { LoggerOptions } from "@/modules/config/types/logger.types";
import type { StringKeyedMessages } from "@/modules/messages/load-local-messages/load-namespace-group/types";
import fs from "node:fs/promises";
import path from "node:path";
import { IntorError, IntorErrorCode } from "@/shared/error";
import { getLogger } from "@/shared/logger/get-logger";

const MAX_PATH_LENGTH = 260;

/**
 * Parses a local JSON message file into a StringKeyedMessages.
 */
export const parseMessageFile = async (
  filePath: string,
  loggerOptions: LoggerOptions & { id: string },
): Promise<StringKeyedMessages | null> => {
  const baseLogger = getLogger({ ...loggerOptions });
  const logger = baseLogger.child({ scope: "parse-message-file" });
  const trimmedPath = filePath.trim();

  if (!trimmedPath) {
    logger.warn("File path is empty.", { filePath: trimmedPath });
    return null;
  }

  if (trimmedPath.length > MAX_PATH_LENGTH) {
    logger.warn("File path exceeds maximum length.", { filePath: trimmedPath });
    return null;
  }

  const fileName = path.basename(trimmedPath);

  if (!fileName.toLowerCase().endsWith(".json")) {
    logger.trace("Skipped non-JSON file.", { filePath: trimmedPath });
    return null;
  }

  try {
    // const { content } = await readMessageRecordFile(trimmedPath, loggerOptions);
    const content = await fs.readFile(trimmedPath, "utf8");
    const parsed = JSON.parse(content) as StringKeyedMessages;
    // Not a MessageObject, throw error
    if (typeof parsed !== "object" || parsed === null) {
      throw new IntorError({
        id: loggerOptions.id,
        code: IntorErrorCode.INVALID_MESSAGE_FORMAT,
        message: "Invalid message format",
      });
    }
    logger.trace("Message file loaded.", { filePath: trimmedPath });
    return parsed;
  } catch (error) {
    logger.warn("Failed to parse message file.", {
      filePath: trimmedPath,
      error,
    });
    return null;
  }
};
