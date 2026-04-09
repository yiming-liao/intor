import type { ReplacementUsage } from "../../../../../../../src/core/extract-usages";
import { describe, it, expect } from "vitest";
import { DIAGNOSTIC_MESSAGES } from "../../../../../../../src/features/check/diagnostics/messages";
import { replacementsNotAllowed } from "../../../../../../../src/features/check/diagnostics/rules/replacement";

function usage(): ReplacementUsage {
  return {
    factory: "useTranslator",
    localName: "t",
    method: "t",
    key: "hello",
    replacements: ["name"],
    file: "test.ts",
    line: 1,
    column: 1,
  };
}

describe("replacementsNotAllowed", () => {
  it("does nothing when key path cannot be resolved", () => {
    const diagnostics = replacementsNotAllowed(
      { ...usage(), key: "" },
      {
        kind: "object",
        properties: {},
      },
    );
    expect(diagnostics).toEqual([]);
  });

  it("reports replacements when schema does not allow them", () => {
    const diagnostics = replacementsNotAllowed(usage(), {
      kind: "primitive",
      type: "string",
    });

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]?.code).toBe(
      DIAGNOSTIC_MESSAGES.REPLACEMENTS_NOT_ALLOWED.code,
    );
  });

  it("does nothing when schema allows replacements", () => {
    const diagnostics = replacementsNotAllowed(usage(), {
      kind: "object",
      properties: {
        hello: {
          kind: "object",
          properties: {
            name: { kind: "primitive", type: "string" },
          },
        },
      },
    });
    expect(diagnostics).toEqual([]);
  });
});
