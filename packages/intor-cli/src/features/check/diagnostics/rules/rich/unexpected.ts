import type { RichUsage, InferNode } from "../../../../../core";
import type { Diagnostic } from "../../types";
import { DIAGNOSTIC_MESSAGES } from "../../messages";
import { getNodeAtPath } from "../../utils/get-node-at-path";
import { resolveKeyPath } from "../../utils/resolve-key-path";

/**
 * @example
 * ```ts
 * // Expected:
 * t("hello", { name })
 *
 * // Received:
 * t("hello", { name, phone })
 * ```
 */
export function richUnexpected(
  usage: RichUsage,
  richSchema: InferNode,
): Diagnostic[] {
  const { method, key, preKey, file, line, column } = usage;

  const keyPath = resolveKeyPath(key, preKey);
  if (!keyPath) return [];

  const schemaNode = getNodeAtPath(richSchema, keyPath);
  if (!schemaNode || schemaNode.kind !== "object") return [];

  const expected = Object.keys(schemaNode.properties);
  const actual = usage.rich;
  const unexpected = actual.filter((tag) => !expected.includes(tag));

  if (unexpected.length > 0) {
    return [
      {
        origin: method,
        messageKey: keyPath,
        code: DIAGNOSTIC_MESSAGES.RICH_UNEXPECTED.code,
        message: DIAGNOSTIC_MESSAGES.RICH_UNEXPECTED.message(unexpected),
        file,
        line,
        column,
      },
    ];
  }

  return [];
}
