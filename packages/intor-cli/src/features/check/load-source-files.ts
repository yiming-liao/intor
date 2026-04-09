import type { SourceFile } from "ts-morph";
import fs from "node:fs";
import path from "node:path";
import { getSourceFiles, readTsConfigReferences } from "../../infrastructure";
import { createLogger } from "../../shared";
import { br, yellow } from "../../shared";

/**
 * Load source files from a tsconfig.
 *
 * Strategy:
 * 1. Load source files from the root tsconfig directly.
 * 2. If empty, follow one level of project references.
 * 3. Return all collected source files for downstream analysis.
 */
export function loadSourceFiles(
  tsconfigPath: string,
  debug = false,
): SourceFile[] {
  if (debug) br();
  const logger = createLogger(debug);

  logger.header("Load source files - processing tsconfig", {
    kind: "process",
  });

  // ---------------------------------------------------------------------------
  // Load source files directly from the target tsconfig
  // ---------------------------------------------------------------------------
  const rootFiles = getSourceFiles(tsconfigPath);
  if (rootFiles.length > 0) {
    logger.footer(`loaded ${yellow(rootFiles.length)} files`, {
      kind: "process",
    });
    return rootFiles;
  }

  // ---------------------------------------------------------------------------
  // Fall back to one-level project references when the root config is empty
  // ---------------------------------------------------------------------------
  const referencePaths = readTsConfigReferences(tsconfigPath);

  if (referencePaths.length === 0) {
    logger.footer("no source files found", { kind: "process" });
    return [];
  }

  logger.log();
  logger.process("load", `references (${referencePaths.length})`);

  // ---------------------------------------------------------------------------
  // Load source files from each referenced tsconfig
  // ---------------------------------------------------------------------------
  const collected: SourceFile[] = [];

  for (const refPath of referencePaths) {
    // Skip missing referenced tsconfig files
    if (!fs.existsSync(refPath)) {
      logger.process(
        "warn",
        `referenced tsconfig not found: ${path.relative(process.cwd(), refPath)}`,
      );
      continue;
    }

    logger.process("load", path.relative(process.cwd(), refPath));
    collected.push(...getSourceFiles(refPath));
  }

  // Final summary for the fallback path
  logger.footer(`loaded ${yellow(collected.length)} files`, {
    kind: "process",
    lineBreakBefore: 1,
  });

  return collected;
}
