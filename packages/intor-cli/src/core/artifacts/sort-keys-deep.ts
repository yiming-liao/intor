// Locale-agnostic, deterministic string comparator.
export function compareStableStrings(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

// Only normalize plain records; leave class instances and special objects intact.
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const proto = Reflect.getPrototypeOf(value); // object | null
  return proto === Object.prototype || proto === null;
}

// Preserve array order, normalize each element recursively.
function sortKeysDeepInternal(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((v) => sortKeysDeepInternal(v));
  }

  // Build a new object with deterministically sorted keys (non-mutating).
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    const keys = Object.keys(value).sort(compareStableStrings);

    for (const key of keys) {
      out[key] = sortKeysDeepInternal(value[key]);
    }

    return out;
  }

  return value;
}

/**
 * Recursively sort plain-object keys with a deterministic comparator.
 *
 * Arrays keep their original order, while each array item is processed recursively.
 */
export function sortKeysDeep<T>(value: T): T {
  return sortKeysDeepInternal(value) as T;
}
