import type { Messages } from "../types";

/** Check if a value is a plain object (not null, not array) */
export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Check if a value is a valid **Messages** object.
 *
 * - Uses an iterative approach to avoid stack overflow with deeply nested objects.
 *
 * @example
 * ```ts
 * isValidMessages({ en: { hello: "Hello" } }) // true
 * isValidMessages({ en: { count: 5 } }) // false
 * ```
 */
export function isValidMessages(value: unknown): value is Messages {
  if (!isPlainObject(value)) return false;

  const stack: Record<string, unknown>[] = [value];

  while (stack.length > 0) {
    const current = stack.pop()!;

    for (const v of Object.values(current)) {
      if (typeof v === "string") continue;
      if (isPlainObject(v)) {
        stack.push(v);
      } else {
        return false;
      }
    }
  }

  return true;
}
