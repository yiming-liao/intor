import type { InferNode } from "../../../../../src/core";
import type { MissingRequirements } from "../../../../../src/features/validate/missing/collect-missing-requirements";
import { describe, it, expect } from "vitest";
import { collectMissingReplacements } from "../../../../../src/features/validate/missing/collect-missing-replacements";

function createResult(): MissingRequirements {
  return {
    missingMessages: [],
    missingReplacements: [],
    missingRich: [],
  };
}

describe("collectMissingReplacements", () => {
  it("does nothing when schema is not an object", () => {
    const schema: InferNode = { kind: "none" };
    const messages = { greeting: "Hello {name}" };
    const result = createResult();
    collectMissingReplacements(schema, messages, "", result);
    expect(result.missingReplacements).toEqual([]);
  });

  it("reports missing replacements for a message", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        greeting: {
          kind: "object",
          properties: {
            name: { kind: "primitive", type: "string" },
          },
        },
      },
    };
    const messages = {
      greeting: "Hello",
    };
    const result = createResult();
    collectMissingReplacements(schema, messages, "", result);
    expect(result.missingReplacements).toEqual([
      { key: "greeting", name: "name" },
    ]);
  });

  it("does not report when all replacements are present", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        greeting: {
          kind: "object",
          properties: {
            name: { kind: "primitive", type: "string" },
          },
        },
      },
    };
    const messages = {
      greeting: "Hello {name}",
    };
    const result = createResult();
    collectMissingReplacements(schema, messages, "", result);
    expect(result.missingReplacements).toEqual([]);
  });

  it("reports missing replacements with correct nested path", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        home: {
          kind: "object",
          properties: {
            title: {
              kind: "object",
              properties: {
                name: { kind: "primitive", type: "string" },
              },
            },
          },
        },
      },
    };
    const messages = {
      home: {
        title: "Welcome",
      },
    };
    const result = createResult();
    collectMissingReplacements(schema, messages, "", result);
    expect(result.missingReplacements).toEqual([
      { key: "home.title", name: "name" },
    ]);
  });

  it("ignores non-string message values", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        count: {
          kind: "object",
          properties: {
            value: { kind: "primitive", type: "string" },
          },
        },
      },
    };
    const messages = {
      count: 123,
    };
    const result = createResult();
    collectMissingReplacements(schema, messages, "", result);
    expect(result.missingReplacements).toEqual([]);
  });

  it("ignores schema keys that do not define replacements", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        plain: { kind: "none" },
      },
    };
    const messages = {
      plain: "Just text",
    };
    const result = createResult();
    collectMissingReplacements(schema, messages, "", result);
    expect(result.missingReplacements).toEqual([]);
  });
});
