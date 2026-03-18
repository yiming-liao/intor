import type { KeyUsage } from "../../../../../../../src/core/extract-usages";
import type { KeyUsageLike } from "../../../../../../../src/features/check/diagnostics/rules/key/types";
import { describe, it, expect } from "vitest";
import { DIAGNOSTIC_MESSAGES } from "../../../../../../../src/features/check/diagnostics/messages";
import { keyEmpty } from "../../../../../../../src/features/check/diagnostics/rules/key";

function createUsage(partial: Partial<KeyUsage>): KeyUsageLike {
  return {
    origin: "t",
    localName: "t",
    key: "",
    file: "/test.ts",
    line: 1,
    column: 1,
    ...partial,
  };
}

describe("keyEmpty", () => {
  it("reports warn for empty message key", () => {
    const diagnostics = keyEmpty(createUsage({ key: "" }));
    expect(diagnostics).toEqual([
      {
        severity: "warn",
        origin: "t",
        messageKey: "",
        code: DIAGNOSTIC_MESSAGES.KEY_EMPTY.code,
        message: DIAGNOSTIC_MESSAGES.KEY_EMPTY.message(),
        file: "/test.ts",
        line: 1,
        column: 1,
      },
    ]);
  });

  it("returns no diagnostics for existing message key", () => {
    const diagnostics = keyEmpty(createUsage({ key: "hello" }));
    expect(diagnostics).toEqual([]);
  });
});
