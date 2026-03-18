import type { ReplacementUsage } from "../../../../../../../src/core/extract-usages";
import type { InferNode } from "../../../../../../../src/core/infer-shape";
import { describe, it, expect } from "vitest";
import { DIAGNOSTIC_MESSAGES } from "../../../../../../../src/features/check/diagnostics/messages";
import { replacementsMissing } from "../../../../../../../src/features/check/diagnostics/rules/replacement";

const schema: InferNode = {
  kind: "object",
  properties: {
    name: {
      kind: "object",
      properties: {
        name: { kind: "primitive", type: "string" },
        phone: { kind: "primitive", type: "string" },
      },
    },
  },
};

function usage(replacements: string[]): ReplacementUsage {
  return {
    factory: "useTranslator",
    localName: "t",
    method: "t",
    key: "name",
    replacements,
    file: "test.ts",
    line: 1,
    column: 1,
  };
}

describe("replacementsMissing", () => {
  it("reports missing required replacements", () => {
    const diagnostics = replacementsMissing(usage(["name"]), schema);
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]?.code).toBe(
      DIAGNOSTIC_MESSAGES.REPLACEMENTS_MISSING.code,
    );
    expect(diagnostics[0]?.message).toContain("phone");
  });

  it("does nothing when all required replacements are provided", () => {
    const diagnostics = replacementsMissing(usage(["name", "phone"]), schema);
    expect(diagnostics).toEqual([]);
  });

  it("does nothing when schema is not an object", () => {
    const diagnostics = replacementsMissing(usage(["name"]), {
      kind: "primitive",
      type: "string",
    });
    expect(diagnostics).toEqual([]);
  });
});
