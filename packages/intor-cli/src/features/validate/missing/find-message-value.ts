import type { MessageObject, MessageValue } from "intor";

function findMessageAtSegments(
  candidate: MessageValue | undefined,
  segments: string[],
  start = 0,
): MessageValue | undefined {
  if (start >= segments.length) {
    return candidate;
  }

  if (
    candidate === null ||
    typeof candidate !== "object" ||
    Array.isArray(candidate)
  ) {
    return undefined;
  }

  const objectCandidate = candidate as Record<string, MessageValue>;

  for (let end = segments.length; end > start; end--) {
    const segment = segments.slice(start, end).join(".");
    if (!(segment in objectCandidate)) continue;

    const next = objectCandidate[segment];
    if (end === segments.length) {
      return next;
    }

    const resolved = findMessageAtSegments(next, segments, end);
    if (resolved !== undefined) {
      return resolved;
    }
  }

  return undefined;
}

/**
 * Find a locale message by exact dotted key first, then by nested traversal.
 */
export function findMessageValue(
  messages: MessageObject,
  path: string,
): MessageValue | undefined {
  if (!path) return undefined;
  return findMessageAtSegments(messages, path.split("."));
}
