/* eslint-disable unicorn/prefer-ternary */
type PlainObject = Record<string, unknown>;

/**
 * Deeply merges two objects.
 *
 * - Nested objects → merged recursively
 * - Array / primitive → b overwrites a
 *
 * This function always returns a plain object.
 */
export const deepMerge = <T extends PlainObject, U extends PlainObject>(
  a: T = {} as T,
  b: U = {} as U,
): T & U => {
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
        result[key] = deepMerge(av as PlainObject, bv as PlainObject);
      } else {
        result[key] = bv;
      }
    }
  }

  return result as T & U;
};
