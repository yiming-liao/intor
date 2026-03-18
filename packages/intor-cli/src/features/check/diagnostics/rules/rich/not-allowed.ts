import type { RichUsage, InferNode } from "../../../../../core";
import type { Diagnostic } from "../../types";
import { DIAGNOSTIC_MESSAGES } from "../../messages";
import { getSchemaNodeAtPath } from "../../utils/get-schema-node-at-path";
import { resolveKeyPath } from "../../utils/resolve-key-path";

/**
 * @example
 * ```ts
 * // Expected:
 * tRich("hello")
 *
 * // Received:
 * tRich("hello", { link })
 * ```
 */
export function richNotAllowed(
  usage: RichUsage,
  richSchema: InferNode,
): Diagnostic[] {
  const { method, key, preKey, file, line, column } = usage;

  const keyPath = resolveKeyPath(key, preKey);
  const schemaNode = getSchemaNodeAtPath(richSchema, keyPath);

  if (!schemaNode || schemaNode.kind !== "object") {
    return [
      {
        severity: "warn",
        origin: method,
        messageKey: keyPath,
        code: DIAGNOSTIC_MESSAGES.RICH_NOT_ALLOWED.code,
        message: DIAGNOSTIC_MESSAGES.RICH_NOT_ALLOWED.message(),
        file,
        line,
        column,
      },
    ];
  }

  return [];
}
