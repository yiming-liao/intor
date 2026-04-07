import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

type TsConfigReference = { path: string };
type TsConfigJson = { references?: TsConfigReference[] };

/**
 * Check whether a value is a valid tsconfig `references` array.
 */
function isReferenceArray(value: unknown): value is TsConfigReference[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as { path?: unknown }).path === "string",
    )
  );
}

/**
 * Parse a tsconfig file and keep only the supported shape.
 */
function parseTsConfig(filePath: string): TsConfigJson {
  // Use TypeScript's parser so `tsconfig.json` can include JSONC syntax
  const result = ts.readConfigFile(filePath, (path) => ts.sys.readFile(path));
  const raw = result.config as unknown;

  if (
    typeof raw === "object" &&
    raw !== null &&
    isReferenceArray((raw as { references?: unknown }).references)
  ) {
    return {
      references: (raw as { references: TsConfigReference[] }).references,
    };
  }

  return {};
}

/**
 * Resolve a reference target to a tsconfig file path.
 */
function resolveReferencePath(configDir: string, refPath: string): string {
  const resolvedPath = path.resolve(configDir, refPath);

  // Directory references imply the default `tsconfig.json`
  if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
    return path.join(resolvedPath, "tsconfig.json");
  }

  return resolvedPath;
}

/**
 * Read and resolve project reference paths from a tsconfig file.
 */
export function readTsConfigReferences(tsconfigPath: string): string[] {
  const configDir = path.dirname(tsconfigPath);
  const { references = [] } = parseTsConfig(tsconfigPath);

  // Resolve reference paths relative to the current tsconfig directory
  return references.map((ref) => resolveReferencePath(configDir, ref.path));
}
