import type { CollectFileEntriesParams } from "./types";
import type { FileEntry } from "../types";
import type { Dirent } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { getLogger } from "../../../../../core";

/**
 * Recursively collects message file metadata under a given locale root.
 *
 * - Traverses directories and collects matching message files
 * - Supports filtering by file extensions and optional namespaces
 *
 * @example
 * ```ts
 * [{
 *     namespace: "auth", // If messages under locale root (no namespace) -> "index"
 *     fullPath: "/Users/john/my-app/messages/en-US/auth/login.json",
 *     relativePath: "auth/login.json",
 *     segments: ["auth", "login"],
 *     basename: "login",
 * }, ... ];
 * ```
 */
export async function collectFileEntries({
  readdir = fs.readdir,
  namespaces,
  rootDir,
  limit,
  exts = [],
  loggerOptions,
}: CollectFileEntriesParams): Promise<FileEntry[]> {
  const baseLogger = getLogger(loggerOptions);
  const logger = baseLogger.child({ scope: "collect-file-entries" });

  const supportedExts = new Set(["json", ...exts]);
  const fileEntries: FileEntry[] = [];

  // Recursive directory walk
  const walk = async (currentDir: string) => {
    // -------------------------------------------------------------------------
    // Read directory entries
    // -------------------------------------------------------------------------
    let entries: Dirent[] = [];
    try {
      entries = await readdir(currentDir, { withFileTypes: true });
    } catch {
      logger.debug("Locale directory not found, skipping locale.", {
        localeDir: currentDir,
      });
      return;
    }

    // -------------------------------------------------------------------------
    // 1. Recurse into sub-directories (control flow, no limit)
    // -------------------------------------------------------------------------
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      await walk(path.join(currentDir, entry.name));
    }

    // -------------------------------------------------------------------------
    // 2. Process files (IO-bound, concurrency-limited)
    // -------------------------------------------------------------------------
    const tasks = entries
      .filter((entry) => entry.isFile())
      .map((entry) =>
        limit(async () => {
          const fullPath = path.join(currentDir, entry.name);

          const ext = path.extname(entry.name).slice(1);
          if (!ext || !supportedExts.has(ext)) return;

          const relativePath = path.relative(rootDir, fullPath);
          const withoutExt = relativePath.slice(
            0,
            relativePath.length - (ext.length + 1),
          );

          const segments = withoutExt.split(path.sep).filter(Boolean);
          const namespace = segments.at(0);
          if (!namespace) return;

          // Apply namespace filter (always allow "index")
          if (namespaces && namespace !== "index") {
            if (!namespaces.includes(namespace)) return;
          }

          fileEntries.push({
            namespace,
            fullPath,
            relativePath,
            segments,
            basename: path.basename(entry.name, `.${ext}`),
          });
        }),
      );

    await Promise.all(tasks);
  };

  await walk(rootDir);

  if (fileEntries.length > 0) {
    logger.trace(
      `Collected ${fileEntries.length} local message files for locale "${path.basename(rootDir)}".`,
    );
  }
  return fileEntries;
}
