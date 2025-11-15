import type { LoggerOptions } from "@/modules/config/types/logger.types";
import type { StringKeyedMessages } from "@/modules/messages/load-local-messages/load-namespace-group/types";
import path from "node:path";
import { parseMessageFile } from "./parse-message-file";

/**
 * Merges the content of multiple namespace message files into a base and sub message record.
 */
export const mergeNamespaceMessages = async (
  filePaths: string[],
  isAtRoot: boolean,
  loggerOptions: LoggerOptions & { id: string },
): Promise<{ base: StringKeyedMessages; sub: StringKeyedMessages }> => {
  const baseContent: StringKeyedMessages = {};
  const subEntries: StringKeyedMessages = {};

  // Process each file and merge content into respective records
  await Promise.all(
    filePaths.map(async (filePath) => {
      const fileName = path.basename(filePath);
      const content = await parseMessageFile(filePath, loggerOptions);

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
