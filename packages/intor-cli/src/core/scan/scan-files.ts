import fg from "fast-glob";

const DEFAULT_PATTERNS = ["**/*.{ts,js}"];

const DEFAULT_IGNORE = [
  "**/node_modules/**",
  "**/dist/**",
  "**/*.d.ts",
  "**/*.test.*",
  "**/*.test-d.ts",
];

interface ScanFilesOptions {
  patterns?: string[];
  ignore?: string[];
  cwd?: string;
}

export async function scanFiles({
  patterns = DEFAULT_PATTERNS,
  ignore = DEFAULT_IGNORE,
  cwd = process.cwd(),
}: ScanFilesOptions = {}) {
  return fg(patterns, { ignore, cwd });
}
