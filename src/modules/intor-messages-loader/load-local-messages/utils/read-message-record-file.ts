import fs from "node:fs/promises";
import path from "node:path";
import { MessageRecord } from "intor-translator";

/**
 * Parses a JSON message file and returns its name and content.
 *
 * @param filePath - Absolute path to the .json file
 * @returns File name (without extension) and parsed content
 * @throws If the file cannot be read or contains invalid JSON
 */
export const readMessageRecordFile = async <T extends MessageRecord>(
  filePath: string,
): Promise<{ fileName: string; content: T }> => {
  const fileName = path.basename(filePath, ".json");
  const content = await fs.readFile(filePath, "utf-8");

  const parsed = JSON.parse(content);

  // Not a MessageObject, throw error
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error(`Invalid message format`);
  }

  return { fileName, content: parsed as T };
};
