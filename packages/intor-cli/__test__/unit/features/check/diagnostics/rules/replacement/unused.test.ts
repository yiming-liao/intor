import type { ReplacementUsage } from "../../../../../../../src/core/extract-usages";
import type { InferNode } from "../../../../../../../src/core/infer-shape";
import { describe, it, expect } from "vitest";
import { DIAGNOSTIC_MESSAGES } from "../../../../../../../src/features/check/diagnostics/messages";
import { replacementsUnused } from "../../../../../../../src/features/check/diagnostics/rules/replacement";

function usage(replacements: string[]): ReplacementUsage {
  return {
    factory: "useTranslator",
    localName: "t",
    method: "t",
    key: "hello",
    replacements,
    file: "test.ts",
    line: 1,
    column: 1,
  };
}

const schema: InferNode = {
  kind: "object",
  properties: {
    hello: {
      kind: "object",
      properties: {
        name: { kind: "primitive", type: "string" },
      },
    },
  },
};

describe("replacementsUnused", () => {
  it("reports unused replacements", () => {
    const diagnostics = replacementsUnused(usage(["name", "phone"]), schema);
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]?.code).toBe(
      DIAGNOSTIC_MESSAGES.REPLACEMENTS_UNUSED.code,
    );
    expect(diagnostics[0]?.message).toContain("phone");
  });

  it("does nothing when no unused replacements exist", () => {
    const diagnostics = replacementsUnused(usage(["name"]), schema);
    expect(diagnostics).toEqual([]);
  });

  it("does nothing when schema does not allow replacements", () => {
    const diagnostics = replacementsUnused(usage(["phone"]), {
      kind: "object",
      properties: { hello: { kind: "primitive", type: "string" } },
    });
    expect(diagnostics).toEqual([]);
  });
});
