import path from "node:path";
import { MessageRecord } from "intor-translator";
import { readMessageRecordFile } from "@/modules/messages-loader/load-local-messages/utils/read-message-record-file";
import { getLogger } from "@/shared/logger/get-logger";

const MAX_PATH_LENGTH = 260;

/**
 * Parses a local JSON message file into a MessageRecord.
 */
export const parseMessageFile = async (
  filePath: string,
  configId: string,
): Promise<MessageRecord | null> => {
  const baseLogger = getLogger({ id: configId });
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
    const { content } = await readMessageRecordFile(trimmedPath, configId);
    logger.trace(`Message file loaded.`, { filePath: trimmedPath });
    return content;
  } catch (error) {
    logger.warn("Failed to parse message file.", {
      filePath: trimmedPath,
      error,
    });
    return null;
  }
};
