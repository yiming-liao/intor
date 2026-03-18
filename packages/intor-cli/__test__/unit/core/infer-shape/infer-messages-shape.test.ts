import { describe, it, expect } from "vitest";
import { inferMessagesShape } from "../../../../src/core/infer-shape/infer-messages-shape";

describe("inferMessagesShape", () => {
  it("returns none for empty message object", () => {
    const result = inferMessagesShape({});
    expect(result).toEqual({ kind: "none" });
  });

  it("infers primitive string values", () => {
    const result = inferMessagesShape({
      greeting: "hello",
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        greeting: { kind: "primitive", type: "string" },
      },
    });
  });

  it("infers primitive number, boolean and null values", () => {
    const result = inferMessagesShape({
      count: 1,
      active: true,
      empty: null,
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        count: { kind: "primitive", type: "number" },
        active: { kind: "primitive", type: "boolean" },
        empty: { kind: "primitive", type: "null" },
      },
    });
  });

  it("infers array values using first-element policy", () => {
    const result = inferMessagesShape({
      list: ["a", "b", "c"],
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        list: {
          kind: "array",
          element: { kind: "primitive", type: "string" },
        },
      },
    });
  });

  it("infers empty arrays as array of none", () => {
    const result = inferMessagesShape({
      list: [],
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        list: {
          kind: "array",
          element: { kind: "none" },
        },
      },
    });
  });

  it("infers nested objects recursively", () => {
    const result = inferMessagesShape({
      user: {
        name: "Alice",
        age: 18,
      },
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        user: {
          kind: "object",
          properties: {
            name: { kind: "primitive", type: "string" },
            age: { kind: "primitive", type: "number" },
          },
        },
      },
    });
  });

  it("prunes unsupported values inside objects", () => {
    const result = inferMessagesShape({
      valid: "ok",
      invalid: undefined as unknown as string,
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        valid: { kind: "primitive", type: "string" },
      },
    });
  });

  it("falls back to record node for empty inferred object", () => {
    const result = inferMessagesShape({
      nested: {},
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        nested: { kind: "record" },
      },
    });
  });

  it("falls back to record node when all object branches are pruned", () => {
    const result = inferMessagesShape({
      a: undefined as unknown as string,
      b: undefined as unknown as string,
    });
    expect(result).toEqual({ kind: "record" });
  });
});
