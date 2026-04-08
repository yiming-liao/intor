import type { RichUsage } from "../../../../../../../src/core/extract-usages";
import type { InferNode } from "../../../../../../../src/core/infer-shape";
import { describe, it, expect } from "vitest";
import { DIAGNOSTIC_MESSAGES } from "../../../../../../../src/features/check/diagnostics/messages";
import { richNotAllowed } from "../../../../../../../src/features/check/diagnostics/rules/rich";

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

describe("richNotAllowed", () => {
  it("does nothing when key path cannot be resolved", () => {
    const diagnostics = richNotAllowed(
      { ...usage(["a"]), key: "" },
      {
        kind: "object",
        properties: {},
      } as InferNode,
    );
    expect(diagnostics).toEqual([]);
  });

  it("reports rich tags when schema does not allow them", () => {
    const diagnostics = richNotAllowed(usage(["a"]), {
      kind: "object",
      properties: {
        hello: { kind: "primitive", type: "string" },
      },
    } as InferNode);
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]?.code).toBe(
      DIAGNOSTIC_MESSAGES.RICH_NOT_ALLOWED.code,
    );
  });

  it("does nothing when schema allows rich tags", () => {
    const diagnostics = richNotAllowed(usage(["a"]), {
      kind: "object",
      properties: {
        hello: {
          kind: "object",
          properties: {
            a: { kind: "primitive", type: "string" },
          },
        },
      },
    });
    expect(diagnostics).toEqual([]);
  });
});
