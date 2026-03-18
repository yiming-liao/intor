import type { InferredShapes } from "../../../../../src/core";
import { describe, it, expect } from "vitest";
import { collectMissingRequirements } from "../../../../../src/features/validate/missing/collect-missing-requirements";

describe("collectMissingRequirements", () => {
  it("returns empty result when schemas define no constraints", () => {
    const schemas: InferredShapes = {
      messages: { kind: "none" },
      replacements: { kind: "none" },
      rich: { kind: "none" },
    };
    const messages = {};
    const result = collectMissingRequirements(schemas, messages);
    expect(result).toEqual({
      missingMessages: [],
      missingReplacements: [],
      missingRich: [],
    });
  });

  it("aggregates missing keys, replacements, and rich tags", () => {
    const schemas: InferredShapes = {
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
    const result = collectMissingRequirements(schemas, messages);
    expect(result).toEqual({
      missingMessages: [],
      missingReplacements: [{ key: "greeting", name: "name" }],
      missingRich: [{ key: "greeting", tag: "a" }],
    });
  });

  it("reports missing keys before other validations", () => {
    const schemas: InferredShapes = {
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
    const result = collectMissingRequirements(schemas, messages);
    expect(result.missingMessages).toEqual(["title"]);
    expect(result.missingReplacements).toEqual([]);
    expect(result.missingRich).toEqual([]);
  });
});
