import type { InferredShapes } from "../../../../../src/core";
import { describe, it, expect } from "vitest";
import { collectMissing } from "../../../../../src/features/validate/missing/collect";

describe("collectMissing", () => {
  it("returns empty result when shapes define no constraints", () => {
    const shapes: InferredShapes = {
      messages: { kind: "none" },
      replacements: { kind: "none" },
      rich: { kind: "none" },
    };
    const messages = {};
    const result = collectMissing(shapes, messages);
    expect(result).toEqual({
      missingMessages: [],
      missingReplacements: [],
      missingRich: [],
    });
  });

  it("aggregates missing keys, replacements, and rich tags", () => {
    const shapes: InferredShapes = {
      messages: {
        kind: "object",
        properties: {
          greeting: { kind: "primitive", type: "string" },
        },
      },
      replacements: {
        kind: "object",
        properties: {
          greeting: {
            kind: "object",
            properties: {
              name: { kind: "none" },
            },
          },
        },
      },
      rich: {
        kind: "object",
        properties: {
          greeting: {
            kind: "object",
            properties: {
              a: { kind: "none" },
            },
          },
        },
      },
    };
    const messages = {
      greeting: "Hello",
    };
    const result = collectMissing(shapes, messages);
    expect(result).toEqual({
      missingMessages: [],
      missingReplacements: [{ key: "greeting", name: "name" }],
      missingRich: [{ key: "greeting", tag: "a" }],
    });
  });

  it("reports missing keys before other validations", () => {
    const shapes: InferredShapes = {
      messages: {
        kind: "object",
        properties: {
          title: { kind: "primitive", type: "string" },
        },
      },
      replacements: { kind: "none" },
      rich: { kind: "none" },
    };
    const messages = {};
    const result = collectMissing(shapes, messages);
    expect(result.missingMessages).toEqual(["title"]);
    expect(result.missingReplacements).toEqual([]);
    expect(result.missingRich).toEqual([]);
  });

  it("ignores missing replacements and rich tags for absent messages", () => {
    const shapes: InferredShapes = {
      messages: { kind: "none" },
      replacements: {
        kind: "object",
        properties: {
          greeting: {
            kind: "object",
            properties: {
              name: { kind: "none" },
            },
          },
        },
      },
      rich: {
        kind: "object",
        properties: {
          greeting: {
            kind: "object",
            properties: {
              strong: { kind: "none" },
            },
          },
        },
      },
    };

    const result = collectMissing(shapes, {});

    expect(result).toEqual({
      missingMessages: [],
      missingReplacements: [],
      missingRich: [],
    });
  });
});
