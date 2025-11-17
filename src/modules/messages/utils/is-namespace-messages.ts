import type { NamespaceMessages } from "@/modules/messages/types";

/** Check if a value is a plain object (not null, not array) */
export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Check if a value is a valid **NamespaceMessages** object.
 *
 * - Uses an iterative approach to avoid stack overflow with deeply nested objects.
 *
 * @example
 * ```ts
 * isNamespaceMessages({ en: { hello: "Hello" } }) // true
 * isNamespaceMessages({ en: { count: 5 } }) // false
 * ```
 */
export function isNamespaceMessages(
  value: unknown,
): value is NamespaceMessages {
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
