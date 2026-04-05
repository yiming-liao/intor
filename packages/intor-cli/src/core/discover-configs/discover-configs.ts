import fs from "node:fs";
import path from "node:path";
import { type IntorResolvedConfig } from "intor";
import { globFiles } from "../../infrastructure/glob-files";
import { createLogger } from "../../logger";
import { br, yellow } from "../../render";
import { resolveConfigModule } from "./resolve-config-module";

export interface ConfigEntry {
  filePath: string;
  config: IntorResolvedConfig;
}

/**
 * Discover and resolve Intor configs from the current workspace.
 *
 * Notes:
 * - Only files containing `defineIntorConfig(...)` are considered.
 * - Dynamic or computed configs are not supported.
 */
export async function discoverConfigs(debug = false): Promise<ConfigEntry[]> {
  // ----------------------------------------------------------------------
  // Get all possible file paths
  // ----------------------------------------------------------------------
  const files = await globFiles();

  if (debug) br();
  const logger = createLogger(debug);
  logger.header(
    `Discover configs - scanning ${yellow(files.length)} candidate files`,
    { kind: "process", lineBreakAfter: 1 },
  );

  const configEntries: ConfigEntry[] = [];
  const ids = new Set<string>();

  // Iterate through candidate files
  for (const file of files) {
    const absPath = path.resolve(process.cwd(), file);
    const relPath = path.relative(process.cwd(), absPath);

    // ----------------------------------------------------------------------
    // Read candidate file content
    // ----------------------------------------------------------------------
    let content: string;
    try {
      content = await fs.promises.readFile(absPath, "utf8");
    } catch {
      logger.process("warn", `failed to read ${relPath}`);
      continue;
    }

    // ----------------------------------------------------------------------
    // Skip files that do not contain `defineIntorConfig`
    // ----------------------------------------------------------------------
    if (!content.includes("defineIntorConfig(")) {
      logger.process("skip", `${relPath} (missing defineIntorConfig)`);
      continue;
    }
    logger.process("load", relPath);

    // ----------------------------------------------------------------------
    // Resolve config entries from module exports
    // ----------------------------------------------------------------------
    const entries = await resolveConfigModule({
      ids,
      absPath,
      relPath,
      logger,
    });
    configEntries.push(...entries);
  }

  if (configEntries.length === 0) {
    logger.process("warn", "no Intor config discovered");
  }

  logger.footer(
    `scanned ${yellow(files.length)} files, resolved ${yellow(
      configEntries.length,
    )} Intor config(s)`,
    { kind: "process", lineBreakBefore: 1 },
  );
  return configEntries.sort((a, b) => a.filePath.localeCompare(b.filePath));
}
