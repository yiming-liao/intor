import type { ReplacementUsage } from "../../../../../../../src/core/extract-usages";
import type { InferNode } from "../../../../../../../src/core/infer-shape";
import { describe, it, expect } from "vitest";
import { DIAGNOSTIC_MESSAGES } from "../../../../../../../src/features/check/diagnostics/messages";
import { replacementUnexpected } from "../../../../../../../src/features/check/diagnostics/rules/replacement";

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

describe("replacementUnexpected", () => {
  it("does nothing when key path cannot be resolved", () => {
    const diagnostics = replacementUnexpected(
      { ...usage(["name"]), key: "" },
      schema,
    );
    expect(diagnostics).toEqual([]);
  });

  it("reports unexpected replacements", () => {
    const diagnostics = replacementUnexpected(usage(["name", "phone"]), schema);
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]?.code).toBe(
      DIAGNOSTIC_MESSAGES.REPLACEMENTS_UNEXPECTED.code,
    );
    expect(diagnostics[0]?.message).toContain("phone");
  });

  it("does nothing when no unexpected replacements exist", () => {
    const diagnostics = replacementUnexpected(usage(["name"]), schema);
    expect(diagnostics).toEqual([]);
  });

  it("does nothing when schema does not allow replacements", () => {
    const diagnostics = replacementUnexpected(usage(["phone"]), {
      kind: "object",
      properties: { hello: { kind: "primitive", type: "string" } },
    });
    expect(diagnostics).toEqual([]);
  });
});
