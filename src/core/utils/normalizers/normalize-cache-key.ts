const CACHE_KEY_DELIMITER = "|";

const sanitize = (k: string) =>
  k
    .replaceAll(/[\u200B-\u200D\uFEFF]/g, "")
    .replaceAll(/[\r\n]/g, "")
    .trim();

type RawCacheKey =
  | string
  | boolean
  | Array<string | number | boolean | undefined | null>;

/**
 * Normalizes a value into a stable cache key string.
 *
 * - Supports primitive values and structured array keys.
 * - Produces deterministic output suitable for cache identifiers.
 *
 * Notes:
 * - `null`, `undefined`, or empty arrays return `null`.
 * - Special tokens are used for boolean, null, and undefined values
 *   to preserve semantic differences.
 */
export const normalizeCacheKey = (
  key?: RawCacheKey,
  delimiter: string = CACHE_KEY_DELIMITER,
): string | null => {
  // Treat nullish values as "no cache key"
  if (key === null || key === undefined) return null;

  if (Array.isArray(key)) {
    // Empty array produces no meaningful cache key
    if (key.length === 0) return null;

    const normalized = key.map((k) => {
      // Preserve semantic differences for special values
      if (k === null) return "__null";
      if (k === undefined) return "__undefined";
      if (typeof k === "boolean") return k ? "__true" : "__false";
      return sanitize(String(k));
    });

    // Join segments into a single deterministic cache key
    return normalized.join(delimiter);
  }

  // Normalize boolean primitives explicitly
  if (typeof key === "boolean") return key ? "__true" : "__false";

  // Fallback: stringify primitive values
  return String(key);
};
