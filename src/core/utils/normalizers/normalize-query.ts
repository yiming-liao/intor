/**
 * Normalize a raw query object into a string-only map.
 *
 * This utility is used to sanitize framework-specific query inputs
 * into a stable shape that the routing core
 * can safely consume.
 *
 * Behavior:
 * - Keeps only entries whose values are strings
 * - Ignores arrays, objects, and other non-string values
 * - Does not throw or attempt to coerce values
 *
 * This function is intentionally conservative by design.
 */
export function normalizeQuery(
  query: Record<string, unknown>,
): Record<string, string | undefined> {
  const normalized: Record<string, string | undefined> = {};

  for (const [key, value] of Object.entries(query)) {
    if (typeof value === "string") {
      normalized[key] = value;
    }
  }

  return normalized;
}
