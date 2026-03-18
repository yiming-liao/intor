import type { InferNode } from "../../../../infer-shape";

/**
 * Normalize inferred rich schema before type emission.
 *
 * Rich schema normalization rules:
 *
 * - `none` means: the tag exists but has no nested structure
 *   → normalize to `record` so it emits `Record<string, never>`
 *   → this preserves tag presence while preventing arbitrary indexing
 *
 * - `object` nodes are recursively normalized
 *
 * This normalization is required to keep rich tag autocompletion working.
 */
export function normalizeRichInferNode(node: InferNode): InferNode {
  // Leaf rich tag: presence marker only
  if (node.kind === "none") {
    return {
      kind: "record",
    };
  }

  // Recursively normalize nested rich tag trees
  if (node.kind === "object") {
    return {
      kind: "object",
      properties: Object.fromEntries(
        Object.entries(node.properties).map(([key, child]) => [
          key,
          normalizeRichInferNode(child),
        ]),
      ),
    };
  }

  // Other kinds should not appear in rich schema,
  // but are passed through defensively
  return node;
}
