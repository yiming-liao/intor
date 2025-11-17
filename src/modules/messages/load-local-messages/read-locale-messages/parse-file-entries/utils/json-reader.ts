import type { NamespaceMessages } from "@/modules/messages/shared/types";
import fs from "node:fs/promises";
import { isNamespaceMessages } from "@/modules/messages/shared/utils/is-namespace-messages";

/**
 *  Read a JSON file and validate that it matches **NamespaceMessages** structure.
 */
export async function jsonReader(
  filePath: string,
  readFile = fs.readFile,
): Promise<NamespaceMessages> {
  // Read
  const raw = await readFile(filePath, "utf8");

  // Parse
  const parsed = JSON.parse(raw);

  // Validate messages structure
  if (!isNamespaceMessages(parsed)) {
    throw new Error("JSON file does not match NamespaceMessages structure");
  }

  return parsed;
}
