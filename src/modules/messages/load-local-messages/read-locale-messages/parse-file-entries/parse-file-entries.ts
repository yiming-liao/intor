import type { ParseFileEntriesOptions, ParsedFileEntries } from "./types";
import type { Messages } from "@/modules/messages/shared/types";
import path from "node:path";
import merge from "lodash.merge";
import { isValidMessages } from "@/modules/messages/shared/utils/is-valid-messages";
import { getLogger } from "@/shared/logger/get-logger";
import { jsonReader } from "./utils/json-reader";
import { nestObjectFromPath } from "./utils/nest-object-from-path";

/**
 * Parse locale message files (JSON or custom formats) into a unified LocaleMessages object.
 *
 * - Supports JSON and custom formats (via `customReader`)
 * - Uses optional concurrency control (`limit`)
 * - Builds nested objects based on file path segments
 * - Deep-merges entries that belong to the same namespace
 *
 * @example
 * ```plain
 * File paths:
 *   - en/index.json        = { a: "A" }
 *   - en/ui.json           = { b: "B" }
 *   - en/auth/index.json   = { c: "C" }
 *   - en/auth/verify.json  = { d: "D" }
 *```

 * The final return value is a LocaleMessages object:
 * ```ts
 * {
 *   en: {
 *     a: "A",
 *     ui: { b: "B" },
 *     auth: {
 *       c: "C",
 *       verify: { d: "D" },
 *     },
 *   },
 * }
 * ```
 */
export async function parseFileEntries({
  fileEntries,
  limit,
  extraOptions: { messagesReader, loggerOptions } = {},
}: ParseFileEntriesOptions): Promise<Messages> {
  const baseLogger = getLogger({ ...loggerOptions });
  const logger = baseLogger.child({ scope: "parse-file-entries" });

  // Read and parse all file entries
  const parsedFileEntries: ParsedFileEntries[] = [];
  const tasks = fileEntries.map(({ namespace, segments, basename, fullPath }) =>
    limit(async () => {
      try {
        const segsWithoutNs = segments.slice(1);
        const ext = path.extname(fullPath);

        // Use a custom reader if provided (e.g., for YAML)
        const json =
          ext !== ".json" && messagesReader
            ? await messagesReader(fullPath)
            : await jsonReader(fullPath);

        // Validate messages structure
        if (!isValidMessages(json)) {
          throw new Error(
            "JSON file does not match NamespaceMessages structure",
          );
        }

        const isIndex = basename === "index";
        const keyPath = isIndex ? segsWithoutNs.slice(0, -1) : segsWithoutNs;

        // Nest the parsed content based on the path segments
        const nested = nestObjectFromPath(keyPath, json);

        parsedFileEntries.push({ namespace, messages: nested });
        logger.trace("Parsed file.", { path: fullPath });
      } catch (error) {
        logger.error("Failed to read or parse file.", {
          path: fullPath,
          error,
        });
      }
    }),
  );
  await Promise.all(tasks);

  // Merge all entries belonging to the same namespace
  const result: Messages = {};
  for (const { namespace, messages } of parsedFileEntries) {
    // Handle root-level namespace (i.e., [rootDir]/index.json)
    if (namespace === "index") {
      merge(result, messages);
    } else {
      result[namespace] = merge(
        (result[namespace] as Messages) ?? {},
        messages,
      );
    }
  }

  return result;
}
