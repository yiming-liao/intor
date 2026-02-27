export type PlainObject = Record<string, unknown>;

export interface DeepMergeOverrideEvent {
  /** Dot-separated property path. */
  path: string;
  /** Previous value before merge. */
  prev: unknown;
  /** Next value after merge. */
  next: unknown;
  /** Type of change. */
  kind: "add" | "override";
}

interface DeepMergeOptions {
  onOverride?: (event: DeepMergeOverrideEvent) => void;
  _path?: string[];
}

/**
 * Deeply merges two plain objects.
 *
 * - Nested plain objects → merged recursively
 * - Arrays / primitives → `b` overwrites `a`
 *
 * Debug behavior (optional):
 * - Emits override events via `onOverride`
 * - Zero overhead when no options are provided
 *
 * This function always returns a new plain object.
 */
export const deepMerge = <T extends PlainObject, U extends PlainObject>(
  a: T = {} as T,
  b: U = {} as U,
  options?: DeepMergeOptions,
): T & U => {
  const result: PlainObject = { ...a };
  const basePath = options?._path ?? [];

  // Iterate only over b's own enumerable properties
  for (const key in b) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) continue;

    const aValue = a[key as keyof T];
    const bValue = b[key as keyof U];
    const nextPath = [...basePath, key];

    // Recursively merge when both sides are plain objects
    if (
      aValue &&
      bValue &&
      typeof aValue === "object" &&
      typeof bValue === "object" &&
      !Array.isArray(aValue) &&
      !Array.isArray(bValue)
    ) {
      result[key] = deepMerge(
        aValue as PlainObject,
        bValue as PlainObject,
        options ? { ...options, _path: nextPath } : undefined,
      );
    } else {
      // Emit override event only when debugging is enabled
      const isAdd = aValue === undefined;
      options?.onOverride?.({
        path: nextPath.join("."),
        prev: aValue,
        next: bValue,
        kind: isAdd ? "add" : "override",
      });

      result[key] = bValue;
    }
  }

  return result as T & U;
};
