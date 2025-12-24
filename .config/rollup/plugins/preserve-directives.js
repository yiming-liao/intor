import MagicString from "magic-string";
import { createFilter } from "@rollup/pluginutils";

/**
 * Preserve specified directives (e.g. "use client") at the top of output files.
 * - Requires `preserveModules: true`.
 *
 * @param {Object} [options]
 * @param {string|string[]} [options.directives=["use client"]]
 *        Directive(s) to preserve, e.g. "use client", ["use client", "use server"]
 * @param {string[]} [options.include]
 *        Minimatch patterns of files to include
 * @param {string[]} [options.exclude]
 *        Minimatch patterns of files to exclude
 * @returns {import("rollup").Plugin}
 */
export function preserveDirectives(options = {}) {
  const {
    directives = ["use client"],
    include = ["**/*.{js,ts,jsx,tsx}"],
    exclude = [],
  } = options;

  // Normalize directives to an array for simpler downstream logic
  const directiveList = Array.isArray(directives) ? directives : [directives];
  // File filter for transform hook
  const filter = createFilter(include, exclude);

  return {
    name: "intor:preserve-directives",

    /** Detect leading directives and record them on module meta. */
    transform(code, id) {
      if (!filter(id)) return null;
      const ast = this.parse(code);
      if (ast.type !== "Program" || !ast.body?.length) {
        return { code, ast, map: null };
      }
      for (const node of ast.body) {
        // Stop scanning once we leave the directive zone
        if (node.type !== "ExpressionStatement") break;
        if (directiveList.includes(node.directive)) {
          return {
            code,
            ast,
            map: null,
            meta: { preserveDirectives: directiveList },
          };
        }
      }
      return { code, ast, map: null };
    },

    /** Re-inject preserved directives at the top of the output chunk. */
    renderChunk: {
      order: "post",
      handler(code, chunk, outputOptions) {
        if (!outputOptions.preserveModules) {
          this.warn(`preserveDirectives requires { preserveModules: true }.`);
          return null;
        }
        if (!chunk.modules) return null;

        // Find the first module in this chunk that declared directives
        let directivesToInject;
        for (const moduleId of Object.keys(chunk.modules)) {
          const meta = this.getModuleInfo(moduleId)?.meta;
          if (meta?.preserveDirectives) {
            directivesToInject = meta.preserveDirectives;
            break;
          }
        }
        if (!directivesToInject) return null;

        // Prepend directives to the very top of the chunk
        const s = new MagicString(code);
        const header = directivesToInject.map((d) => `"${d}";`).join("\n");
        s.prepend(`${header}\n`);
        return {
          code: s.toString(),
          map: s.generateMap({ includeContent: true }),
        };
      },
    },
  };
}
