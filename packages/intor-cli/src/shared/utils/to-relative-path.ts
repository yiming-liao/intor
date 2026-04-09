import path from "node:path";

/**
 * Convert an absolute file path to a workspace-relative path
 * suitable for CLI display.
 */
export function toRelativePath(filePath: string): string {
  const relative = path.relative(process.cwd(), filePath);
  return relative || ".";
}
