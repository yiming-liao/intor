import type { Messages } from "@/server/messages/shared/types";
import fs from "node:fs/promises";

/**
 *  Read & parse a JSON file
 */
export async function jsonReader(
  filePath: string,
  readFile = fs.readFile,
): Promise<Messages> {
  const raw = await readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);
  return parsed;
}
