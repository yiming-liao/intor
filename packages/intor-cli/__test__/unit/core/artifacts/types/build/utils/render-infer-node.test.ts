import type { InferNode } from "../../../../../../../src/core/infer-shape";
import { describe, it, expect } from "vitest";
import { renderInferNode } from "../../../../../../../src/core/artifacts/types/build/utils/render-infer-node";

describe("renderInferNode", () => {
  it("renders none as unknown", () => {
    const node: InferNode = {
      kind: "none",
    };
    expect(renderInferNode(node)).toBe("unknown");
  });

  it("renders primitive types", () => {
    const node: InferNode = {
      kind: "primitive",
      type: "string",
    };
    expect(renderInferNode(node)).toBe("string");
  });

  it("renders array types", () => {
    const node: InferNode = {
      kind: "array",
      element: {
        kind: "primitive",
        type: "number",
      },
    };
    expect(renderInferNode(node)).toBe("number[]");
  });

  it("renders record types as non-indexable record", () => {
    const node: InferNode = {
      kind: "record",
    };
    expect(renderInferNode(node)).toBe("Record<string, never>");
  });

  it("renders object types with properties", () => {
    const node: InferNode = {
      kind: "object",
      properties: {
        title: { kind: "primitive", type: "string" },
        count: { kind: "primitive", type: "number" },
      },
    };
    expect(renderInferNode(node, 2)).toBe(`{
      "title": string;
      "count": number;
    }`);
  });

  it("renders deeply nested object types", () => {
    const node: InferNode = {
      kind: "object",
      properties: {
        meta: {
          kind: "object",
          properties: {
            createdAt: { kind: "primitive", type: "string" },
          },
        },
      },
    };
    expect(renderInferNode(node, 2)).toBe(`{
      "meta": {
        "createdAt": string;
      };
    }`);
  });
});
