/* eslint-disable unicorn/prefer-ternary */
type PlainObject = Record<string, unknown>;

/**
 * Deeply merges two objects.
 * - Nested objects → merged recursively
 * - Array / primitive → b overwrites a
 */
export const deepMerge = <T extends PlainObject, U extends PlainObject>(
  a?: T,
  b?: U,
): (T & U) | T | U | undefined => {
  if (!a && !b) return undefined;
  if (!a) return b as U;
  if (!b) return a as T;

  const result: PlainObject = { ...a };

  for (const key in b) {
    if (Object.prototype.hasOwnProperty.call(b, key)) {
      const av = a[key as keyof T];
      const bv = b[key as keyof U];

      if (
        av &&
        bv &&
        typeof av === "object" &&
        typeof bv === "object" &&
        !Array.isArray(av) &&
        !Array.isArray(bv)
      ) {
        // recursive merge
        result[key] = deepMerge(av as PlainObject, bv as PlainObject);
      } else {
        // overwrite with primitive or array
        result[key] = bv;
      }
    }
  }

  return result as T & U;
};
