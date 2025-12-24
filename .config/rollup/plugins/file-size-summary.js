import { gzipSync as gzip } from "node:zlib";

/**
 * Print a summary of total JS bundle size (raw + gzipped).
 * - Internal build diagnostics only.
 *
 * @returns {import("rollup").Plugin}
 */
export function fileSizeSummary() {
  return {
    name: "file-size-summary",

    /** Aggregate and print bundle size after generation. */
    generateBundle(_, bundle) {
      let totalRawSize = 0;
      let totalGzipSize = 0;

      for (const output of Object.values(bundle)) {
        // Only count JavaScript chunks, ignore assets
        if (output.type !== "chunk") continue;
        totalRawSize += output.code.length;
        totalGzipSize += gzip(output.code).length;
      }

      console.log("\n────── Bundle Summary ──────");
      console.log(
        ` ${"Total size:".padEnd(14)} ${(totalRawSize / 1024).toFixed(2)} KB`,
      );
      console.log(
        ` ${"Total gzipped:".padEnd(14)} ${(totalGzipSize / 1024).toFixed(2)} KB`,
      );
      console.log("────────────────────────────\n");
    },
  };
}
