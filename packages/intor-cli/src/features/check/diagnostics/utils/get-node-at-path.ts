import type { InferNode } from "../../../../core";

/**
 * Resolve a dot-separated key path to a inferred node.
 *
 * Returns:
 *   - InferNode if the path exists
 *   - null if any segment is missing or non-object
 */
export function getNodeAtPath(
  shape: InferNode,
  path: string,
): InferNode | null {
  if (shape.kind !== "object") return null;

  const segments = path.split(".");
  let node: InferNode = shape;

  for (const segment of segments) {
    if (node.kind !== "object") return null;

    const next: InferNode | undefined = node.properties[segment];
    if (!next) return null;

    node = next;
  }

  return node;
}
