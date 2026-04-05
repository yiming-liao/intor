import fg from "fast-glob";

const DEFAULT_PATTERNS = ["**/*.{ts,js}"];

const DEFAULT_IGNORE = [
  "**/node_modules/**",
  "**/dist/**",
  "**/*.d.ts",
  "**/*.test.*",
  "**/*.test-d.ts",
];

interface GlobFilesOptions {
  patterns?: string[];
  ignore?: string[];
  cwd?: string;
}

export async function globFiles({
  patterns = DEFAULT_PATTERNS,
  ignore = DEFAULT_IGNORE,
  cwd = process.cwd(),
}: GlobFilesOptions = {}): Promise<string[]> {
  return (await fg(patterns, { ignore, cwd })).sort();
}
