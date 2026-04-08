import type { RichUsage, InferNode } from "../../../../../core";
import type { Diagnostic } from "../../types";
import { DIAGNOSTIC_MESSAGES } from "../../messages";
import { getNodeAtPath } from "../../utils/get-node-at-path";
import { resolveKeyPath } from "../../utils/resolve-key-path";

/**
 * @example
 * ```ts
 * // Expected:
 * tRich("hello", { link })
 *
 * // Received:
 * tRich("hello", { link, b })
 * ```
 */
export function richMissing(usage: RichUsage, shape: InferNode): Diagnostic[] {
  const { method, key, preKey, file, line, column } = usage;

  const keyPath = resolveKeyPath(key, preKey);
  if (!keyPath) return [];

  const node = getNodeAtPath(shape, keyPath);
  if (!node || node.kind !== "object") return [];

  const expected = Object.keys(node.properties);
  const actual = usage.rich;
  const missing = expected.filter((tag) => !actual.includes(tag));

  if (missing.length > 0) {
    return [
      {
        origin: method,
        messageKey: keyPath,
        code: DIAGNOSTIC_MESSAGES.RICH_MISSING.code,
        message: DIAGNOSTIC_MESSAGES.RICH_MISSING.message(missing),
        file,
        line,
        column,
      },
    ];
  }

  return [];
}
