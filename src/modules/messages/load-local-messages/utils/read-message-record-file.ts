import fs from "node:fs/promises";
import path from "node:path";
import { MessageRecord } from "intor-translator";
import { LoggerOptions } from "@/modules/config/types/logger.types";
import { IntorError, IntorErrorCode } from "@/shared/error";

/**
 * Parses a JSON message file and returns its name and content.
 */
export const readMessageRecordFile = async <T extends MessageRecord>(
  filePath: string,
  loggerOptions: LoggerOptions & { id: string },
): Promise<{ fileName: string; content: T }> => {
  const fileName = path.basename(filePath, ".json");
  const content = await fs.readFile(filePath, "utf-8");

  const parsed = JSON.parse(content);

  // Not a MessageObject, throw error
  if (typeof parsed !== "object" || parsed === null) {
    throw new IntorError({
      id: loggerOptions.id,
      code: IntorErrorCode.INVALID_MESSAGE_FORMAT,
      message: "Invalid message format",
    });
  }

  return { fileName, content: parsed as T };
};
