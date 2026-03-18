import type { RichUsage, InferNode } from "../../../../../core";
import type { Diagnostic } from "../../types";
import { DIAGNOSTIC_MESSAGES } from "../../messages";
import { getSchemaNodeAtPath } from "../../utils/get-schema-node-at-path";
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
export function richUnused(
  usage: RichUsage,
  richSchema: InferNode,
): Diagnostic[] {
  const { method, key, preKey, file, line, column } = usage;

  const keyPath = resolveKeyPath(key, preKey);
  const schemaNode = getSchemaNodeAtPath(richSchema, keyPath);
  if (!schemaNode || schemaNode.kind !== "object") return [];

  const expected = Object.keys(schemaNode.properties);
  const actual = usage.rich;
  const extra = actual.filter((tag) => !expected.includes(tag));

  if (extra.length > 0) {
    return [
      {
        severity: "warn",
        origin: method,
        messageKey: keyPath,
        code: DIAGNOSTIC_MESSAGES.RICH_UNUSED.code,
        message: DIAGNOSTIC_MESSAGES.RICH_UNUSED.message(extra),
        file,
        line,
        column,
      },
    ];
  }

  return [];
}
