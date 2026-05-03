import type { InferNode } from "../../../../../../src/core/infer-shape";
import { describe, it, expect } from "vitest";
import { getNodeAtPath } from "../../../../../../src/features/check/diagnostics/utils/get-node-at-path";

describe("getNodeAtPath", () => {
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
    const node = getNodeAtPath(schema, "greeting");
    expect(node).toEqual({ kind: "primitive", type: "string" });
  });

  it("prefers an exact dotted key match before nested traversal", () => {
    const dottedSchema: InferNode = {
      kind: "object",
      properties: {
        "a.b": { kind: "primitive", type: "string" },
        a: {
          kind: "object",
          properties: {
            b: { kind: "primitive", type: "number" },
          },
        },
      },
    };

    const node = getNodeAtPath(dottedSchema, "a.b");

    expect(node).toEqual({ kind: "primitive", type: "string" });
  });

  it("returns the node for a nested key path", () => {
    const node = getNodeAtPath(schema, "a.b.c");
    expect(node).toEqual({ kind: "primitive", type: "number" });
  });

  it("resolves nested values under a flat dotted parent key", () => {
    const hybridSchema: InferNode = {
      kind: "object",
      properties: {
        "a.b": {
          kind: "object",
          properties: {
            c: { kind: "primitive", type: "string" },
          },
        },
      },
    };

    const node = getNodeAtPath(hybridSchema, "a.b.c");

    expect(node).toEqual({ kind: "primitive", type: "string" });
  });

  it("resolves nested values under mixed dotted keys across levels", () => {
    const hybridSchema: InferNode = {
      kind: "object",
      properties: {
        a: {
          kind: "object",
          properties: {
            "b.c": {
              kind: "object",
              properties: {
                d: { kind: "primitive", type: "boolean" },
              },
            },
          },
        },
      },
    };

    const node = getNodeAtPath(hybridSchema, "a.b.c.d");

    expect(node).toEqual({ kind: "primitive", type: "boolean" });
  });

  it("returns null for a non-existing top-level key", () => {
    const node = getNodeAtPath(schema, "missing");
    expect(node).toBeNull();
  });

  it("returns null for a non-existing nested path", () => {
    const node = getNodeAtPath(schema, "a.b.missing");
    expect(node).toBeNull();
  });

  it("returns null when path traverses into a non-object node", () => {
    const node = getNodeAtPath(schema, "greeting.foo");
    expect(node).toBeNull();
  });

  it("returns null for empty path", () => {
    const node = getNodeAtPath(schema, "");
    expect(node).toBeNull();
  });

  it("returns null when schema root is not an object", () => {
    const primitiveSchema: InferNode = {
      kind: "primitive",
      type: "string",
    };
    const node = getNodeAtPath(primitiveSchema, "anything");
    expect(node).toBeNull();
  });

  it("returns null when schema is none", () => {
    const noneSchema: InferNode = { kind: "none" };
    const node = getNodeAtPath(noneSchema, "a");
    expect(node).toBeNull();
  });
});
