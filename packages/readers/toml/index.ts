import type { MessageObject, MessagesReader } from "intor";
import fs from "node:fs/promises";
import { parse } from "@iarna/toml";

/**
 * Read a TOML source and return a MessageObject.
 */
export const tomlReader: MessagesReader = async (
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
