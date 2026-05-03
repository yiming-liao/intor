import type { InferNode } from "../../../../core";

function getNodeAtSegments(
  node: InferNode,
  segments: string[],
  start = 0,
): InferNode | null {
  if (start >= segments.length) {
    return node;
  }

  if (node.kind !== "object") {
    return null;
  }

  for (let end = segments.length; end > start; end--) {
    const segment = segments.slice(start, end).join(".");
    const next = node.properties[segment];
    if (!next) continue;

    if (end === segments.length) {
      return next;
    }

    const resolved = getNodeAtSegments(next, segments, end);
    if (resolved) {
      return resolved;
    }
  }

  return null;
}

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
  if (!path) return null;
  return getNodeAtSegments(shape, path.split("."));
}

/**
 * Check whether a path exists exactly or can address descendant keys by prefix.
 */
export function hasNodeAtPathPrefix(shape: InferNode, path: string): boolean {
  if (getNodeAtPath(shape, path)) return true;
  if (shape.kind !== "object" || !path) return false;

  return hasNodeAtPathPrefixInObject(shape, path);
}

function hasNodeAtPathPrefixInObject(
  node: Extract<InferNode, { kind: "object" }>,
  path: string,
  basePath?: string,
): boolean {
  for (const [key, child] of Object.entries(node.properties)) {
    const fullPath = basePath ? `${basePath}.${key}` : key;

    if (fullPath.startsWith(`${path}.`)) {
      return true;
    }

    if (
      child?.kind === "object" &&
      hasNodeAtPathPrefixInObject(child, path, fullPath)
    ) {
      return true;
    }
  }

  return false;
}
