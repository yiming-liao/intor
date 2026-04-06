import type { MessageObject, MessagesReader } from "intor";
import fs from "node:fs/promises";
import JSON5 from "json5";

/**
 * Read a JSON5 source and return a MessageObject.
 */
export const json5Reader: MessagesReader = async (
  filePath,
  readFile = fs.readFile,
): Promise<MessageObject> => {
  // --------------------------------------------------
  // Read file
  // --------------------------------------------------
  const raw = await readFile(filePath, "utf8");

  // --------------------------------------------------
  // Parse content
  // --------------------------------------------------
  const data = JSON5.parse(raw) as MessageObject;

  return data;
};
