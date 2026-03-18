import type { PreKeyUsage, InferNode } from "../../../../../core";
import type { Diagnostic } from "../../types";
import { DIAGNOSTIC_MESSAGES } from "../../messages";
import { getSchemaNodeAtPath } from "../../utils/get-schema-node-at-path";

/**
 * @example
 * ```ts
 * // Expected:
 * useTranslator("hello")
 *
 * // Received:
 * useTranslator("missing")
 * ```
 */
export function preKeyNotFound(
  usage: PreKeyUsage,
  messagesSchema: InferNode,
): Diagnostic[] {
  const { factory, preKey, file, line, column } = usage;

  if (!preKey) return [];

  if (!getSchemaNodeAtPath(messagesSchema, preKey)) {
    return [
      {
        severity: "warn",
        origin: factory,
        messageKey: preKey,
        code: DIAGNOSTIC_MESSAGES.PRE_KEY_NOT_FOUND.code,
        message: DIAGNOSTIC_MESSAGES.PRE_KEY_NOT_FOUND.message(),
        file,
        line,
        column,
      },
    ];
  }

  return [];
}
