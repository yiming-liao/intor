import type { KeyUsageLike } from "./types";
import type { Diagnostic } from "../../types";
import { DIAGNOSTIC_MESSAGES } from "../../messages";

/**
 * @example
 * ```ts
 * // Expected:
 * t("hello")
 *
 * // Received:
 * t("")
 * ```
 */
export function keyEmpty(usage: KeyUsageLike): Diagnostic[] {
  const { origin, key, file, line, column } = usage;

  if (!key) {
    return [
      {
        severity: "warn",
        origin,
        messageKey: key,
        code: DIAGNOSTIC_MESSAGES.KEY_EMPTY.code,
        message: DIAGNOSTIC_MESSAGES.KEY_EMPTY.message(),
        file,
        line,
        column,
      },
    ];
  }

  return [];
}
