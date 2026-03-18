import fs from "node:fs";
import path from "node:path";
import { type IntorResolvedConfig } from "intor";
import { createLogger } from "../../logger";
import { br, cyan, yellow } from "../../render";
import { scanFiles } from "../scan";
import { isIntorResolvedConfig } from "./is-intor-resolved-config";
import { loadModule } from "./load-module";

export interface ConfigEntry {
  filePath: string;
  config: IntorResolvedConfig;
}

/**
 * Discover and resolve Intor configs from the current workspace.
 *
 * Notes:
 * - Configs must be declared via `defineIntorConfig(...)`
 * - Dynamic or computed configs are intentionally not supported
 */
export async function discoverConfigs(debug = false): Promise<ConfigEntry[]> {
  const files = await scanFiles();

  if (debug) br();
  const logger = createLogger(debug);
  logger.header(
    `Discover configs - scanning ${yellow(files.length)} candidate files`,
    { kind: "process", lineBreakAfter: 1 },
  );

  const configEntries: ConfigEntry[] = [];
  const seenIds = new Set<string>();

  // Iterate through candidate files
  for (const file of files) {
    const absPath = path.resolve(process.cwd(), file);
    const relPath = path.relative(process.cwd(), absPath);

    // ----------------------------------------------------------------------
    // Read file content
    // ----------------------------------------------------------------------
    let content: string;
    try {
      content = await fs.promises.readFile(absPath, "utf8");
    } catch {
      logger.process("warn", `failed to read ${relPath}`);
      continue;
    }

    // ----------------------------------------------------------------------
    // Skip files that clearly do not define an Intor config
    // ----------------------------------------------------------------------
    if (!content.includes("defineIntorConfig(")) {
      logger.process("skip", `${relPath} (missing defineIntorConfig)`);
      continue;
    }
    logger.process("load", relPath);

    // ----------------------------------------------------------------------
    // Dynamic import & export inspection
    // ----------------------------------------------------------------------
    try {
      const moduleExports = (await loadModule(absPath)) as Record<
        string,
        IntorResolvedConfig
      >;
      let matched = false;
      let resolvedCount = 0;

      // Loop through all exports
      for (const module of Object.values(moduleExports)) {
        const config = module;
        if (!isIntorResolvedConfig(module)) continue;
        matched = true;

        // Ensure config ids are unique across the workspace
        if (seenIds.has(module.id)) {
          logger.process(
            "warn",
            `duplicate config id "${module.id}" (ignored, ${relPath})`,
          );
          continue;
        }

        seenIds.add(module.id);
        resolvedCount++;

        configEntries.push({ filePath: absPath, config });
        logger.process("ok", `resolved config ${cyan(config.id)}`);
      }

      if (matched && resolvedCount === 0) {
        logger.process("warn", `no usable Intor config export (${relPath})`);
      }
    } catch {
      logger.process("warn", `failed to import module (${relPath})`);
    }
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
