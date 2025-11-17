import type { NamespaceMessages } from "@/modules/messages/types";

/**
 * Wraps a value inside nested objects according to a given path.
 *
 * @example
 * ```ts
 * const value = { a: "A" };
 *
 * nestObjectFromPath(["auth", "verify"], value); // → { auth: { verify: { a: "A" } } }
 *
 * nestObjectFromPath([], value); // →  { a: "A" }
 * ```
 */
export function nestObjectFromPath(
  path: string[],
  value: NamespaceMessages,
): NamespaceMessages {
  let obj: NamespaceMessages = value;
  for (let i = path.length - 1; i >= 0; i--) {
    obj = { [path[i]]: obj };
  }
  return obj;
}
