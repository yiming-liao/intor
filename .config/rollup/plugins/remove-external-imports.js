export function removeExternalImports() {
  const TARGET_PREFIXES = [
    // client
    "src/client",
    // next / navigation
    "src/adapters/next/navigation",
  ];

  const NODE_PREFIX = "node:";
  const MODULES = ["logry", "p-limit", "lodash.merge", "keyv"];

  return {
    name: "remove-external-imports",
    generateBundle(_, bundle) {
      const absImportRegex = new RegExp(
        `^\\s*import\\s+.*?['"](${NODE_PREFIX}.*|${MODULES.join("|")})['"];?`,
        "gm",
      );

      for (const fileName of Object.keys(bundle)) {
        const isTarget = TARGET_PREFIXES.some((t) => fileName.startsWith(t));
        if (!isTarget) continue;

        const chunk = bundle[fileName];
        if (chunk.type === "chunk") {
          chunk.code = chunk.code.replace(absImportRegex, "");
        }
      }
    },
  };
}
