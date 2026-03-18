import type { InferNode } from "../../../../../../src/core";
import { describe, it, expect } from "vitest";
import { normalizeRichInferNode } from "../../../../../../src/core/artifacts/types/build/utils/normalize-rich-infer-node";

describe("normalizeRichInferNode()", () => {
  it("normalizes `none` to `record` (rich leaf presence)", () => {
    const input: InferNode = { kind: "none" };
    const output = normalizeRichInferNode(input);
    expect(output).toEqual({
      kind: "record",
    });
  });

  it("recursively normalizes object nodes containing `none` leaves", () => {
    const input: InferNode = {
      kind: "object",
      properties: {
        a: { kind: "none" },
        b: {
          kind: "object",
          properties: {
            c: { kind: "none" },
          },
        },
      },
    };
    const output = normalizeRichInferNode(input);
    expect(output).toEqual({
      kind: "object",
      properties: {
        a: { kind: "record" },
        b: {
          kind: "object",
          properties: {
            c: { kind: "record" },
          },
        },
      },
    });
  });

  it("preserves existing `record` nodes", () => {
    const input: InferNode = {
      kind: "record",
    };
    const output = normalizeRichInferNode(input);
    expect(output).toEqual({
      kind: "record",
    });
  });

  it("passes through primitive nodes defensively", () => {
    const input: InferNode = {
      kind: "primitive",
      type: "string",
    };
    const output = normalizeRichInferNode(input);
    expect(output).toEqual(input);
  });

  it("passes through array nodes defensively", () => {
    const input: InferNode = {
      kind: "array",
      element: { kind: "none" },
    };
    const output = normalizeRichInferNode(input);
    expect(output).toEqual(input);
  });
});
