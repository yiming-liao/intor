import type { MessageObject } from "intor-translator";
import fs from "node:fs/promises";

/**
 *  Read & parse a JSON file
 */
export async function jsonReader(
  filePath: string,
  readFile = fs.readFile,
): Promise<MessageObject> {
  const raw = await readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as MessageObject;
  return parsed;
}
