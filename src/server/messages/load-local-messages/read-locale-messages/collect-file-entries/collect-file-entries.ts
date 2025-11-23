import type { CollectFileEntriesOptions } from "./types";
import type { FileEntry } from "@/server/messages/load-local-messages/read-locale-messages";
import type { Dirent } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { getLogger } from "@/server/shared/logger/get-logger";

/**
 * Recursively collects all message files under a given root directory.
 *
 * - Supports filtering by allowed file extensions and optional namespaces.
 * - Processes directories concurrently using the provided `limit` function.
 *
 * @example
 * ```ts
 * [
 *   {
 *     namespace: "index", // "index" = messages under locale root (no namespace)
 *     fullPath: "/Users/john/my-app/messages/en-US/index.json",
 *     relativePath: "index.json",
 *     segments: ["index"],
 *     basename: "index",
 *   },
 *   {
 *     namespace: "auth",
 *     fullPath: "/Users/john/my-app/messages/en-US/auth/login.json",
 *     relativePath: "auth/login.json",
 *     segments: ["auth", "login"],
 *     basename: "login",
 *   },
 * ];
 * ```
 */
export async function collectFileEntries({
  readdir = fs.readdir,
  limit,
  rootDir,
  namespaces,
  extraOptions: { exts = [".json"], loggerOptions } = {},
}: CollectFileEntriesOptions): Promise<FileEntry[]> {
  const baseLogger = getLogger({ ...loggerOptions });
  const logger = baseLogger.child({ scope: "collect-file-entries" });

  const results: FileEntry[] = [];

  const walk = async (currentDir: string) => {
    // Read current directory entries
    let entries: Dirent[] = [];
    try {
      entries = await readdir(currentDir, { withFileTypes: true });
    } catch (error) {
      logger.error(`Error reading directory: ${currentDir}`, { error });
      return;
    }

    // Process each directory entry and collect valid files
    const tasks = entries.map((entry) =>
      limit(async () => {
        const fullPath = path.join(currentDir, entry.name);

        // If entry is a directory, recurse into it
        if (entry.isDirectory()) {
          await walk(fullPath);
          return;
        }

        // Only include files with extensions in exts[]
        if (!exts.some((ext) => entry.name.endsWith(ext))) return;

        const relativePath = path.relative(rootDir, fullPath);
        const ext = path.extname(relativePath);
        const withoutExt = relativePath.slice(0, -ext.length);
        const segments = withoutExt.split(path.sep).filter(Boolean);

        const namespace = segments.at(0);
        if (!namespace) return;

        // Filter namespaces if a list is provided (always include "index")
        if (namespaces && namespace !== "index") {
          if (!namespaces.includes(namespace)) return;
        }

        results.push({
          namespace,
          fullPath,
          relativePath,
          segments,
          basename: path.basename(entry.name, ext),
        });
      }),
    );
    await Promise.all(tasks);
  };

  await walk(rootDir);

  // Logs
  if (logger.core.level === "debug") {
    logger.debug("Local message files collected.", {
      count: results.length,
    });
  }
  logger.trace("Local message files collected.", {
    count: results.length,
    fileEntries: results.map(({ namespace, relativePath }) => ({
      namespace: namespace === "index" ? null : namespace,
      relativePath,
    })),
  });

  return results;
}
