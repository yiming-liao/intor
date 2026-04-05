import type { MessagesReader } from "intor";
import fs from "node:fs/promises";
import path from "node:path";

interface ResolveMessagesReaderParams {
  filePath: string;
  loadModule?: (filePath: string) => Promise<unknown>;
}

/**
 * Resolve a MessagesReader from a module path.
 *
 * Resolution order:
 * 1. Default export
 * 2. First exported function
 */
export async function resolveReaderModule({
  filePath,
  loadModule = (filePath: string) => import(filePath),
}: ResolveMessagesReaderParams): Promise<MessagesReader> {
  const absolutePath = path.resolve(process.cwd(), filePath);

  // ----------------------------------------------------------------------
  // Validate reader module path
  // ----------------------------------------------------------------------
  try {
    await fs.access(absolutePath);
  } catch {
    throw new Error(`[intor] Reader file not found: ${filePath}`);
  }

  // ----------------------------------------------------------------------
  // Load module exports
  // ----------------------------------------------------------------------
  const moduleExports = await loadModule(absolutePath);

  let reader: unknown;

  // Prefer default export
  if (
    typeof moduleExports === "object" &&
    moduleExports !== null &&
    "default" in moduleExports
  ) {
    reader = (moduleExports as { default?: unknown }).default;
  }

  // Fallback to first exported function
  if (typeof reader !== "function") {
    if (typeof moduleExports === "object" && moduleExports !== null) {
      for (const value of Object.values(
        moduleExports as Record<string, unknown>,
      )) {
        if (typeof value === "function") {
          reader = value;
          break;
        }
      }
    }
  }

  // ----------------------------------------------------------------------
  // Validate resolved export
  // ----------------------------------------------------------------------
  if (typeof reader !== "function") {
    throw new Error(
      `[intor-cli] No function export found in reader module: ${filePath}`,
    );
  }

  return reader as MessagesReader;
}
