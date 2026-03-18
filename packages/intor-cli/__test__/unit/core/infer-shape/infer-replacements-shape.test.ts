import { describe, it, expect } from "vitest";
import { inferReplacementsShape } from "../../../../src/core/infer-shape/infer-replacements-shape";

describe("inferReplacementsShape", () => {
  it("returns none for empty message object", () => {
    const result = inferReplacementsShape({});
    expect(result).toEqual({ kind: "none" });
  });

  it("returns none when no interpolations are found", () => {
    const result = inferReplacementsShape({
      greeting: "hello world",
    });
    expect(result).toEqual({ kind: "none" });
  });

  it("infers single interpolation from string", () => {
    const result = inferReplacementsShape({
      greeting: "hello {name}",
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        greeting: {
          kind: "object",
          properties: {
            name: { kind: "primitive", type: "string" },
          },
        },
      },
    });
  });

  it("infers multiple interpolations from a single string", () => {
    const result = inferReplacementsShape({
      greeting: "hello {first} {last}",
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        greeting: {
          kind: "object",
          properties: {
            first: { kind: "primitive", type: "string" },
            last: { kind: "primitive", type: "string" },
          },
        },
      },
    });
  });

  it("infers interpolations recursively in nested objects", () => {
    const result = inferReplacementsShape({
      user: {
        greeting: "hi {name}",
      },
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        user: {
          kind: "object",
          properties: {
            greeting: {
              kind: "object",
              properties: {
                name: { kind: "primitive", type: "string" },
              },
            },
          },
        },
      },
    });
  });

  it("ignores array values completely", () => {
    const result = inferReplacementsShape({
      list: ["hello {name}"],
    });
    expect(result).toEqual({ kind: "none" });
  });

  it("prunes branches without interpolations", () => {
    const result = inferReplacementsShape({
      valid: "hi {name}",
      invalid: "hello",
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        valid: {
          kind: "object",
          properties: {
            name: { kind: "primitive", type: "string" },
          },
        },
      },
    });
  });

  it("returns none when all branches are pruned", () => {
    const result = inferReplacementsShape({
      a: "hello",
      b: "world",
    });
    expect(result).toEqual({ kind: "none" });
  });

  it("returns none for unsupported value type", () => {
    inferReplacementsShape({ a: Symbol("x") as unknown as string });
  });
});
