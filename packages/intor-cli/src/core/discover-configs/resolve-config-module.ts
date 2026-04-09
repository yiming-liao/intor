import type { ConfigEntry } from "./discover-configs";
import type { Logger } from "../../shared";
import { cyan } from "../../shared";
import { isIntorResolvedConfig } from "./is-intor-resolved-config";

interface ResolveConfigModuleParams {
  ids: Set<string>;
  absPath: string;
  relPath: string;
  logger: Logger;
  loadModule?: (filePath: string) => Promise<unknown>;
}
/**
 * Import a config module and return unique, valid Intor config entries from its exports.
 */
export async function resolveConfigModule({
  ids,
  absPath,
  relPath,
  logger,
  loadModule = (filePath: string) => import(filePath),
}: ResolveConfigModuleParams): Promise<ConfigEntry[]> {
  let moduleExports: unknown;

  // ----------------------------------------------------------------------
  // Import target module
  // ----------------------------------------------------------------------
  try {
    moduleExports = await loadModule(absPath);
  } catch {
    logger.process("warn", `failed to import module (${relPath})`);
    return [];
  }

  const entries: ConfigEntry[] = [];
  let matched = false;
  let resolvedCount = 0;

  // ----------------------------------------------------------------------
  // Inspect exports and collect valid Intor configs
  // ----------------------------------------------------------------------
  for (const value of Object.values(moduleExports as Record<string, unknown>)) {
    if (!isIntorResolvedConfig(value)) continue;
    matched = true;

    // Skip duplicate config ids across workspace
    if (ids.has(value.id)) {
      logger.process(
        "warn",
        `duplicate config id "${value.id}" (ignored, ${relPath})`,
      );
      continue;
    }

    // Accept unique config
    ids.add(value.id);
    resolvedCount++;
    entries.push({ filePath: absPath, config: value });
    logger.process("ok", `resolved config ${cyan(value.id)}`);
  }

  if (matched && resolvedCount === 0) {
    logger.process("warn", `no usable Intor config export (${relPath})`);
  }

  return entries;
}
