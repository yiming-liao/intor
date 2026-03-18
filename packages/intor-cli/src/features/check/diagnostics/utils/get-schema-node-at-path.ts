import type { InferNode } from "../../../../core";

/**
 * Resolve a dot-separated key path to a schema node.
 *
 * Returns:
 *   - InferNode if the path exists
 *   - null if any segment is missing or non-object
 */
export function getSchemaNodeAtPath(
  schema: InferNode,
  path: string,
): InferNode | null {
  if (schema.kind !== "object") return null;

  const segments = path.split(".");
  let node: InferNode = schema;

  for (const segment of segments) {
    if (node.kind !== "object") return null;

    const next: InferNode | undefined = node.properties[segment];
    if (!next) return null;

    node = next;
  }

  return node;
}
