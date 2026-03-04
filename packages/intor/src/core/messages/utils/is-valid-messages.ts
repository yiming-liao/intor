import type { MessageObject, MessageValue } from "intor-translator";

/** Check if a value is a plain object (not null, not array) */
export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Check if a value is a valid MessageObject.
 *
 * - Supports all MessageValue variants (primitive, array, object).
 * - Uses an iterative approach to avoid stack overflow.
 */
export function isValidMessages(value: unknown): value is MessageObject {
  if (!isPlainObject(value)) return false;

  const stack: unknown[] = [value];

  while (stack.length > 0) {
    const current = stack.pop()! as MessageValue;

    // primitives are always valid
    if (
      current === null ||
      typeof current === "string" ||
      typeof current === "number" ||
      typeof current === "boolean"
    ) {
      continue;
    }

    // array → validate each item
    if (Array.isArray(current)) {
      for (const item of current) {
        stack.push(item);
      }
      continue;
    }

    // object → validate each value
    if (isPlainObject(current)) {
      for (const v of Object.values(current)) {
        stack.push(v);
      }
      continue;
    }

    // everything else is invalid
    return false;
  }

  return true;
}
