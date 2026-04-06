import { describe, it, expect } from "vitest";
import { inferShapes } from "../../../../src/core/infer-shape/infer-shapes";

describe("inferShapes", () => {
  it("returns inferred shapes for messages, replacements and rich", () => {
    const result = inferShapes({
      greeting: "hello {name}",
      title: "<b>Hi</b>",
      count: 1,
    });

    expect(result).toEqual({
      messages: {
        kind: "object",
        properties: {
          greeting: { kind: "primitive", type: "string" },
          title: { kind: "primitive", type: "string" },
          count: { kind: "primitive", type: "number" },
        },
      },
      replacements: {
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
      rich: {
        kind: "object",
        properties: {
          title: {
            kind: "object",
            properties: {
              b: { kind: "none" },
            },
          },
        },
      },
    });
  });

  it("keeps markdown payload in messages but excludes it from replacements and rich", () => {
    const result = inferShapes({
      __intor_kind: "markdown",
      content: "raw {name} <a>title</a>",
      subtitle: "hi {user}",
    });

    expect(result).toEqual({
      messages: {
        kind: "object",
        properties: {
          content: { kind: "primitive", type: "string" },
          subtitle: { kind: "primitive", type: "string" },
        },
      },
      replacements: {
        kind: "object",
        properties: {
          subtitle: {
            kind: "object",
            properties: {
              user: { kind: "primitive", type: "string" },
            },
          },
        },
      },
      rich: { kind: "none" },
    });
  });
});
