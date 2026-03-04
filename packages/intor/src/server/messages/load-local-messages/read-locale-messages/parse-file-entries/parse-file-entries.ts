import type { ParseFileEntriesParams, ParsedFileEntries } from "./types";
import type { MessageObject } from "intor-translator";
import path from "node:path";
import {
  getLogger,
  isValidMessages,
  deepMerge,
  nestObjectFromPath,
} from "../../../../../core";
import { jsonReader } from "./utils/json-reader";

/**
 * Parse locale message files into a unified Messages object (single-locale).
 *
 * - Reads JSON or custom formats (via `messagesReader`)
 * - Validates message structure
 * - Builds nested objects based on file path segments
 * - Deep-merges entries by namespace
 *
 * @example
 * ```plain
 * File paths:
 *   - en/index.json        = { a: "A" }
 *   - en/ui.json           = { b: "B" }
 *   - en/auth/index.json   = { c: "C" }
 *   - en/auth/verify.json  = { d: "D" }
 *```

 * The final return value is a `Messages` object:
 * ```ts
 * {
 *   a: "A",
 *   ui: { b: "B" },
 *   auth: {
 *     c: "C",
 *     verify: { d: "D" },
 *   },
 * }
 * ```
 */
export async function parseFileEntries({
  fileEntries,
  limit,
  readers,
  loggerOptions,
}: ParseFileEntriesParams): Promise<MessageObject> {
  const baseLogger = getLogger(loggerOptions);
  const logger = baseLogger.child({ scope: "parse-file-entries" });

  // Read and parse all file entries
  const parsedFileEntries: ParsedFileEntries[] = [];

  const tasks = fileEntries.map(({ namespace, segments, basename, fullPath }) =>
    limit(async () => {
      try {
        // -------------------------------------------------------------------
        // Read and validate file content
        // -------------------------------------------------------------------
        const ext = path.extname(fullPath).slice(1); // remove dot

        let raw: unknown;
        if (ext === "json") {
          raw = await jsonReader(fullPath);
        } else {
          const reader = readers?.[ext];
          if (!reader) {
            throw new Error(
              `No message reader registered for .${ext} files. ` +
                `Please register a reader for the "${ext}" extension.`,
            );
          }
          raw = await reader(fullPath);
        }

        // Validate messages structure
        if (!isValidMessages(raw)) {
          throw new Error(
            "Parsed content does not match expected Messages structure",
          );
        }

        // -------------------------------------------------------------------
        // Build nested message object from path segments
        // -------------------------------------------------------------------
        const segmentsWithoutNamespace = segments.slice(1);
        const isIndexFile = basename === "index";

        const keyPath = isIndexFile
          ? segmentsWithoutNamespace.slice(0, -1)
          : segmentsWithoutNamespace;

        // Nest the parsed content based on the path segments
        const nestedMessages = nestObjectFromPath(keyPath, raw);

        parsedFileEntries.push({ namespace, messages: nestedMessages });
      } catch (error) {
        logger.warn("Failed to read or parse file.", {
          path: fullPath,
          error,
        });
      }
    }),
  );

  await Promise.all(tasks);

  // ---------------------------------------------------------------------------
  // Merge parsed entries by namespace
  // ---------------------------------------------------------------------------
  const result: MessageObject = {};
  for (const { namespace, messages } of parsedFileEntries) {
    // Root-level namespace (e.g. [locale]/index.json)
    if (namespace === "index") {
      Object.assign(result, deepMerge(result, messages));
    } else {
      result[namespace] = deepMerge(
        result[namespace] as MessageObject,
        messages,
      );
    }
  }

  return result;
}
