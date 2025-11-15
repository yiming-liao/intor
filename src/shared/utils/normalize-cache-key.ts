const CACHE_KEY_DELIMITER = "|";

// Helper FC
const sanitize = (k: string) =>
  k
    .replaceAll(/[\u200B-\u200D\uFEFF]/g, "")
    .replaceAll(/[\r\n]/g, "")
    .trim();

type RawCacheKey =
  | string
  | boolean
  | Array<string | number | boolean | undefined | null>;

export const normalizeCacheKey = (
  key?: RawCacheKey,
  delimiter: string = CACHE_KEY_DELIMITER,
): string | null => {
  if (key === null || key === undefined) return null;

  if (Array.isArray(key)) {
    if (key.length === 0) return null;

    const normalized = key.map((k) => {
      if (k === null) return "__null";
      if (k === undefined) return "__undefined";
      if (typeof k === "boolean") return k ? "__true" : "__false";
      return sanitize(String(k));
    });

    return normalized.join(delimiter);
  }

  if (typeof key === "boolean") return key ? "__true" : "__false";
  return String(key);
};
