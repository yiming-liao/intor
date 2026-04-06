import type { MessageObject, MessagesReader } from "intor";
import fs from "node:fs/promises";
import { parse } from "yaml";

/**
 * Read a YAML source and return a MessageObject.
 */
export const yamlReader: MessagesReader = async (
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
  const data = parse(raw) as MessageObject;

  return data;
};
