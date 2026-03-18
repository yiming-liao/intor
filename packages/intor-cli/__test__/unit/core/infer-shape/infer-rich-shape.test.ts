import { describe, it, expect } from "vitest";
import { inferRichShape } from "../../../../src/core/infer-shape/infer-rich-shape";

describe("inferRichShape", () => {
  it("returns none for empty message object", () => {
    expect(inferRichShape({})).toEqual({ kind: "none" });
  });

  it("returns none when no rich tags are present", () => {
    const result = inferRichShape({
      greeting: "hello world",
      title: "plain text",
    });
    expect(result).toEqual({ kind: "none" });
  });

  it("infers a single rich tag from a string value", () => {
    const result = inferRichShape({
      greeting: "<a>Hello</a>",
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        greeting: {
          kind: "object",
          properties: {
            a: { kind: "none" },
          },
        },
      },
    });
  });

  it("infers multiple different rich tags from a single string", () => {
    const result = inferRichShape({
      greeting: "<a>Link</a><b>Bold</b>",
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        greeting: {
          kind: "object",
          properties: {
            a: { kind: "none" },
            b: { kind: "none" },
          },
        },
      },
    });
  });

  it("deduplicates the same rich tag used multiple times", () => {
    const result = inferRichShape({
      greeting: "<a>One</a><a>Two</a>",
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        greeting: {
          kind: "object",
          properties: {
            a: { kind: "none" },
          },
        },
      },
    });
  });

  it("infers rich tags recursively in nested objects", () => {
    const result = inferRichShape({
      section: {
        title: "<strong>Title</strong>",
      },
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        section: {
          kind: "object",
          properties: {
            title: {
              kind: "object",
              properties: {
                strong: { kind: "none" },
              },
            },
          },
        },
      },
    });
  });

  it("ignores array values completely", () => {
    const result = inferRichShape({
      list: ["<a>hello</a>"],
    });
    expect(result).toEqual({ kind: "none" });
  });

  it("prunes branches without rich tags", () => {
    const result = inferRichShape({
      valid: "<a>link</a>",
      invalid: "plain text",
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        valid: {
          kind: "object",
          properties: {
            a: { kind: "none" },
          },
        },
      },
    });
  });

  it("returns none when all branches are pruned", () => {
    const result = inferRichShape({
      a: "text only",
      b: "still text",
    });
    expect(result).toEqual({ kind: "none" });
  });

  it("ignores markdown content payload entirely", () => {
    const result = inferRichShape({
      content: "<a>markdown</a><b>ignored</b>",
    });
    expect(result).toEqual({ kind: "none" });
  });

  it("handles mixed markdown and rich-capable keys correctly", () => {
    const result = inferRichShape({
      content: "<a>markdown</a>",
      greeting: "<em>Hello</em>",
    });
    expect(result).toEqual({
      kind: "object",
      properties: {
        greeting: {
          kind: "object",
          properties: {
            em: { kind: "none" },
          },
        },
      },
    });
  });

  it("returns none for unsupported value types", () => {
    const result = inferRichShape({
      value: Symbol("x") as unknown as string,
    });
    expect(result).toEqual({ kind: "none" });
  });
});
