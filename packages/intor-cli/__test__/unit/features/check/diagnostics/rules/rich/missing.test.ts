import type { RichUsage } from "../../../../../../../src/core/extract-usages";
import type { InferNode } from "../../../../../../../src/core/infer-shape";
import { describe, it, expect } from "vitest";
import { DIAGNOSTIC_MESSAGES } from "../../../../../../../src/features/check/diagnostics/messages";
import { richMissing } from "../../../../../../../src/features/check/diagnostics/rules/rich";

function usage(tags: string[]): RichUsage {
  return {
    factory: "useTranslator",
    localName: "tRich",
    method: "tRich",
    key: "hello",
    rich: tags,
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
        a: { kind: "primitive", type: "string" },
        b: { kind: "primitive", type: "string" },
      },
    },
  },
};

describe("richMissing", () => {
  it("reports missing required rich tags", () => {
    const diagnostics = richMissing(usage(["a"]), schema);
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]?.code).toBe(DIAGNOSTIC_MESSAGES.RICH_MISSING.code);
    expect(diagnostics[0]?.message).toContain("b");
  });

  it("does nothing when all required rich tags are provided", () => {
    const diagnostics = richMissing(usage(["a", "b"]), schema);
    expect(diagnostics).toEqual([]);
  });

  it("does nothing when schema is not an object", () => {
    const diagnostics = richMissing(usage(["a"]), {
      kind: "object",
      properties: {
        hello: { kind: "primitive", type: "string" },
      },
    } as InferNode);
    expect(diagnostics).toEqual([]);
  });
});
