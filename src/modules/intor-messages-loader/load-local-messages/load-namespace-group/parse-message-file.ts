import path from "node:path";
import { MessageRecord } from "intor-translator";
import { logry } from "logry";
import { readMessageRecordFile } from "@/modules/intor-messages-loader/load-local-messages/utils/read-message-record-file";

const MAX_PATH_LENGTH = 260;

/**
 * Parses a local JSON message file into a MessageRecord.
 */
export const parseMessageFile = async (
  filePath: string,
  loggerId: string,
): Promise<MessageRecord | null> => {
  const logger = logry({ id: loggerId, scope: "parseMessageFile" });
  const trimmedPath = filePath.trim();

  if (!trimmedPath) {
    logger?.warn("Invalid file path provided.", { filePath: trimmedPath });
    return null;
  }

  if (trimmedPath.length > MAX_PATH_LENGTH) {
    logger?.warn("Invalid file path provided.", { filePath: trimmedPath });
    return null;
  }

  const fileName = path.basename(trimmedPath);

  if (!fileName.toLowerCase().endsWith(".json")) {
    logger?.debug(`Skipped non-JSON file.`, { filePath: trimmedPath });
    return null;
  }

  try {
    const { content } = await readMessageRecordFile(trimmedPath);
    logger?.debug(`Loaded a file.`, { filePath: trimmedPath });
    return content;
  } catch (error) {
    logger?.warn(`Failed to load file.`, { filePath: trimmedPath, error });
    return null;
  }
};
