import { gzipSync as gzip } from "node:zlib";

export function fileSizeSummary() {
  return {
    name: "file-size-summary",
    generateBundle(_, bundle) {
      let totalSize = 0;
      let totalGzipSize = 0;

      for (const chunk of Object.values(bundle)) {
        if (chunk.type === "chunk") {
          totalSize += chunk.code.length;
          totalGzipSize += gzip(chunk.code).length;
        }
      }

      console.log("\n------ Bundle Summary ------");
      console.log(
        ` ${"Total size:".padEnd(14)} ${(totalSize / 1024).toFixed(2)} KB`,
      );
      console.log(` Total gzipped: ${(totalGzipSize / 1024).toFixed(2)} KB`);
      console.log("----------------------------\n");
    },
  };
}
