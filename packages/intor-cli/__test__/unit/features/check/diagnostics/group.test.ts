import type { Diagnostic } from "../../../../../src/features/check/diagnostics/types";
import { describe, it, expect } from "vitest";
import { groupDiagnostics } from "../../../../../src/features/check/diagnostics";

function d(partial: Partial<Diagnostic>): Diagnostic {
  return {
    factory: "useTranslator",
    method: "t",
    message: "msg",
    file: "/test.ts",
    line: 1,
    column: 1,
    ...partial,
  } as Diagnostic;
}

describe("groupDiagnostics", () => {
  it("groups diagnostics by file + messageKey + method", () => {
    const result = groupDiagnostics([
      d({ messageKey: "hello", line: 1 }),
      d({ messageKey: "hello", line: 3 }),
    ]);
    expect(result).toHaveLength(1);
    expect(result[0]?.lines).toEqual([1, 3]);
    expect(result[0]?.messageKey).toBe("hello");
  });

  it("falls back to source location when messageKey is missing", () => {
    const result = groupDiagnostics([
      d({ line: 1, column: 1 }),
      d({ line: 1, column: 1 }),
      d({ line: 2, column: 1 }),
    ]);
    expect(result).toHaveLength(2);
  });

  it("deduplicates and sorts line numbers", () => {
    const result = groupDiagnostics([
      d({ messageKey: "x", line: 5 }),
      d({ messageKey: "x", line: 2 }),
      d({ messageKey: "x", line: 5 }),
    ]);
    expect(result[0]?.lines).toEqual([2, 5]);
  });
});
