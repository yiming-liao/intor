import type { RichUsage } from "../../../../../../../src/core/extract-usages";
import type { InferNode } from "../../../../../../../src/core/infer-shape";
import { describe, it, expect } from "vitest";
import { DIAGNOSTIC_MESSAGES } from "../../../../../../../src/features/check/diagnostics/messages";
import { richUnexpected } from "../../../../../../../src/features/check/diagnostics/rules/rich";

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
      },
    },
  },
};

describe("richUnexpected", () => {
  it("does nothing when key path cannot be resolved", () => {
    const diagnostics = richUnexpected({ ...usage(["a"]), key: "" }, schema);
    expect(diagnostics).toEqual([]);
  });

  it("reports unexpected rich tags", () => {
    const diagnostics = richUnexpected(usage(["a", "b"]), schema);
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]?.code).toBe(DIAGNOSTIC_MESSAGES.RICH_UNEXPECTED.code);
    expect(diagnostics[0]?.message).toContain("b");
  });

  it("does nothing when no unexpected rich tags exist", () => {
    const diagnostics = richUnexpected(usage(["a"]), schema);
    expect(diagnostics).toEqual([]);
  });

  it("does nothing when schema does not allow rich tags", () => {
    const diagnostics = richUnexpected(usage(["b"]), {
      kind: "object",
      properties: {
        hello: { kind: "primitive", type: "string" },
      },
    } as InferNode);
    expect(diagnostics).toEqual([]);
  });
});
