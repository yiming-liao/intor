import type { InferNode } from "../../../../../src/core";
import type { MissingRequirements } from "../../../../../src/features/validate/missing/collect-missing-requirements";
import { describe, it, expect } from "vitest";
import { collectMissingMessages } from "../../../../../src/features/validate/missing/collect-missing-messages";

function createResult(): MissingRequirements {
  return {
    missingMessages: [],
    missingReplacements: [],
    missingRich: [],
  };
}

describe("collectMissingMessages", () => {
  it("does nothing when schema is not an object", () => {
    const schema: InferNode = { kind: "none" };
    const messages = { a: "hello" };
    const result = createResult();
    collectMissingMessages(schema, messages, "", result);
    expect(result.missingMessages).toEqual([]);
  });

  it("reports missing top-level keys", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        greeting: { kind: "none" },
        title: { kind: "none" },
      },
    };
    const messages = {
      greeting: "hello",
    };
    const result = createResult();
    collectMissingMessages(schema, messages, "", result);
    expect(result.missingMessages).toEqual(["title"]);
  });

  it("reports missing nested keys with correct dotted path", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        home: {
          kind: "object",
          properties: {
            title: { kind: "none" },
            subtitle: { kind: "none" },
          },
        },
      },
    };
    const messages = {
      home: {
        title: "Hello",
      },
    };
    const result = createResult();
    collectMissingMessages(schema, messages, "", result);
    expect(result.missingMessages).toEqual(["home.subtitle"]);
  });

  it("produces no errors when messages fully satisfy schema", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        home: {
          kind: "object",
          properties: {
            title: { kind: "none" },
          },
        },
      },
    };
    const messages = {
      home: {
        title: "Hello",
      },
    };
    const result = createResult();
    collectMissingMessages(schema, messages, "", result);
    expect(result.missingMessages).toEqual([]);
  });

  it("ignores extra keys in messages that are not defined in schema", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        greeting: { kind: "none" },
      },
    };
    const messages = {
      greeting: "hello",
      extra: "should be ignored",
    };
    const result = createResult();
    collectMissingMessages(schema, messages, "", result);
    expect(result.missingMessages).toEqual([]);
  });

  it("does not recurse into message branches not defined in schema", () => {
    const schema: InferNode = {
      kind: "object",
      properties: {
        a: { kind: "none" },
      },
    };
    const messages = {
      a: "ok",
      nested: {
        missing: "value",
      },
    };
    const result = createResult();
    collectMissingMessages(schema, messages, "", result);
    expect(result.missingMessages).toEqual([]);
  });
});
