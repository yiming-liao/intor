import type { PreKeyUsage, InferNode } from "../../../../../core";
import type { Diagnostic } from "../../types";
import { DIAGNOSTIC_MESSAGES } from "../../messages";
import { hasNodeAtPathPrefix } from "../../utils/get-node-at-path";

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
export function preKeyNotExist(
  usage: PreKeyUsage,
  shape: InferNode,
): Diagnostic[] {
  const { factory, preKey, file, line, column } = usage;

  if (!preKey) return [];

  if (!hasNodeAtPathPrefix(shape, preKey)) {
    return [
      {
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
