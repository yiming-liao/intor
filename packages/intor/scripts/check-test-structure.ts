/* eslint-disable unicorn/no-process-exit */
import fs from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// CLI options
// ---------------------------------------------------------------------------
const argv = new Set(process.argv.slice(2));

const options = {
  includeFiles: argv.has("-v") || argv.has("--verbose"),
  verbose: argv.has("-v") || argv.has("--verbose"),
};

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const SRC_ROOT = path.resolve("src");
const TEST_ROOT = path.resolve("__test__/unit");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type PathSet = Set<string>;

// ---------------------------------------------------------------------------
// Normalize file name for comparison
// - Remove `.test.` / `.spec.` before extension
// ---------------------------------------------------------------------------
function normalizeFileName(fileName: string): string {
  return fileName.replaceAll(".test.", ".").replaceAll(".spec.", ".");
}

// ---------------------------------------------------------------------------
// Collect directories (and optionally files)
// ---------------------------------------------------------------------------
function collectPaths(root: string, base = "", includeFiles = false): PathSet {
  const result: PathSet = new Set();

  if (!fs.existsSync(root)) return result;

  const entries = fs.readdirSync(root, { withFileTypes: true });

  for (const entry of entries) {
    const name = entry.isFile() ? normalizeFileName(entry.name) : entry.name;

    const relativePath = base ? path.join(base, name) : name;

    if (entry.isDirectory()) {
      result.add(relativePath);

      const nextRoot = path.join(root, entry.name);
      const nested = collectPaths(nextRoot, relativePath, includeFiles);

      for (const p of nested) {
        result.add(p);
      }
    }

    if (includeFiles && entry.isFile()) {
      result.add(relativePath);
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Diff
// ---------------------------------------------------------------------------
const srcPaths = collectPaths(SRC_ROOT, "", options.includeFiles);
const testPaths = collectPaths(TEST_ROOT, "", options.includeFiles);

const onlyInSrc = [...srcPaths].filter((p) => !testPaths.has(p));
const onlyInTest = [...testPaths].filter((p) => !srcPaths.has(p));

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------
const targetLabel = options.includeFiles
  ? "directories + files"
  : "directories";

if (options.verbose) {
  console.log(`\nComparing ${targetLabel}:`);
  console.log(`- src:   ${srcPaths.size}`);
  console.log(`- tests: ${testPaths.size}\n`);
}

if (onlyInSrc.length === 0 && onlyInTest.length === 0) {
  console.log(`✓ Structure identical (${targetLabel}).`);
  process.exit(0);
}

console.log(`\nStructure diff (${targetLabel}):\n`);

if (onlyInSrc.length > 0) {
  console.log("• Present in src but missing in tests:");
  for (const p of onlyInSrc) {
    console.log(`  - ${p}`);
  }
  console.log("");
}

if (onlyInTest.length > 0) {
  console.log("• Present in tests but missing in src:");
  for (const p of onlyInTest) {
    console.log(`  - ${p}`);
  }
  console.log("");
}
