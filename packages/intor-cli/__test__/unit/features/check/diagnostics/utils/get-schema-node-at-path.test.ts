import type { InferNode } from "../../../../../../src/core/infer-shape";
import { describe, it, expect } from "vitest";
import { getSchemaNodeAtPath } from "../../../../../../src/features/check/diagnostics/utils/get-schema-node-at-path";

describe("getSchemaNodeAtPath", () => {
  const schema: InferNode = {
    kind: "object",
    properties: {
      greeting: { kind: "primitive", type: "string" },
      a: {
        kind: "object",
        properties: {
          b: {
            kind: "object",
            properties: {
              c: { kind: "primitive", type: "number" },
            },
          },
        },
      },
    },
  };

  it("returns the node for a top-level key", () => {
    const node = getSchemaNodeAtPath(schema, "greeting");
    expect(node).toEqual({ kind: "primitive", type: "string" });
  });

  it("returns the node for a nested key path", () => {
    const node = getSchemaNodeAtPath(schema, "a.b.c");
    expect(node).toEqual({ kind: "primitive", type: "number" });
  });

  it("returns null for a non-existing top-level key", () => {
    const node = getSchemaNodeAtPath(schema, "missing");
    expect(node).toBeNull();
  });

  it("returns null for a non-existing nested path", () => {
    const node = getSchemaNodeAtPath(schema, "a.b.missing");
    expect(node).toBeNull();
  });

  it("returns null when path traverses into a non-object node", () => {
    const node = getSchemaNodeAtPath(schema, "greeting.foo");
    expect(node).toBeNull();
  });

  it("returns null for empty path", () => {
    const node = getSchemaNodeAtPath(schema, "");
    expect(node).toBeNull();
  });

  it("returns null when schema root is not an object", () => {
    const primitiveSchema: InferNode = {
      kind: "primitive",
      type: "string",
    };
    const node = getSchemaNodeAtPath(primitiveSchema, "anything");
    expect(node).toBeNull();
  });

  it("returns null when schema is none", () => {
    const noneSchema: InferNode = { kind: "none" };
    const node = getSchemaNodeAtPath(noneSchema, "a");
    expect(node).toBeNull();
  });
});
