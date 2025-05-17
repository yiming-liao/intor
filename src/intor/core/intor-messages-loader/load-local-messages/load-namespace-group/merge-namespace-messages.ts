import type { IntorLogger } from "../../../../core/intor-logger/intor-logger";
import type { MessageRecord } from "../../../../types/message-structure-types";
import path from "node:path";
import { parseMessageFile } from "./parse-message-file";

/**
 * Merges the content of multiple namespace message files into a base and sub message record.
 *
 * @param filePaths - Array of file paths to JSON message files.
 * @param isAtRoot - Flag indicating whether the current message files are at the root level.
 * @param logger - Optional logger for debugging purposes.
 * @returns An object containing the base message record and sub-namespace message records.
 */
export const mergeNamespaceMessages = async (
  filePaths: string[],
  isAtRoot: boolean,
  logger?: IntorLogger,
): Promise<{ base: MessageRecord; sub: MessageRecord }> => {
  const baseContent: MessageRecord = {};
  const subEntries: MessageRecord = {};

  // Process each file and merge content into respective records
  await Promise.all(
    filePaths.map(async (filePath) => {
      const fileName = path.basename(filePath);
      const content = await parseMessageFile(filePath, logger);

      if (!content) {
        return;
      }

      // Merge content based on file name
      if (fileName === "index.json" || isAtRoot) {
        Object.assign(baseContent, content);
      } else {
        const name = fileName.replace(/\.json$/, "");
        subEntries[name] = content;
      }
    }),
  );

  return { base: baseContent, sub: subEntries };
};
