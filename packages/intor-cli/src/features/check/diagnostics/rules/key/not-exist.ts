import type { KeyUsageLike } from "./types";
import type { InferNode } from "../../../../../core";
import type { Diagnostic } from "../../types";
import { DIAGNOSTIC_MESSAGES } from "../../messages";
import { getNodeAtPath } from "../../utils/get-node-at-path";
import { resolveKeyPath } from "../../utils/resolve-key-path";

/**
 * @example
 * ```ts
 * // Expected:
 * t("hello")
 *
 * // Received:
 * t("missing")
 * ```
 */
export function keyNotExist(
  usage: KeyUsageLike,
  shape: InferNode,
): Diagnostic[] {
  const { method, key, preKey, file, line, column } = usage;

  const keyPath = resolveKeyPath(key, preKey);
  if (!keyPath) return [];

  const node = getNodeAtPath(shape, keyPath);

  if (!node) {
    return [
      {
        origin: method,
        messageKey: keyPath,
        code: DIAGNOSTIC_MESSAGES.KEY_NOT_FOUND.code,
        message: DIAGNOSTIC_MESSAGES.KEY_NOT_FOUND.message(),
        file,
        line,
        column,
      },
    ];
  }

  return [];
}
