/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { parseRichMessage } from "../../src/message/parse-rich-message";

describe("parseRichMessage", () => {
  it("parses a rich string message into semantic AST", () => {
    const ast = parseRichMessage("Hello <b>world</b>");
    expect(ast).toEqual([
      { type: "text", value: "Hello " },
      {
        type: "tag",
        name: "b",
        attributes: {},
        children: [{ type: "text", value: "world" }],
      },
    ]);
  });

  it("parses nested semantic tags correctly", () => {
    const ast = parseRichMessage("<b><i>text</i></b>");
    expect(ast).toEqual([
      {
        type: "tag",
        name: "b",
        attributes: {},
        children: [
          {
            type: "tag",
            name: "i",
            attributes: {},
            children: [{ type: "text", value: "text" }],
          },
        ],
      },
    ]);
  });

  it("stringifies and parses primitive message values", () => {
    expect(parseRichMessage(123)).toEqual([{ type: "text", value: "123" }]);
    expect(parseRichMessage(true)).toEqual([{ type: "text", value: "true" }]);
  });

  it("recursively parses array message values", () => {
    const ast = parseRichMessage(["Hello ", "<b>world</b>"]);
    expect(ast).toEqual([
      { type: "text", value: "Hello " },
      {
        type: "tag",
        name: "b",
        attributes: {},
        children: [{ type: "text", value: "world" }],
      },
    ]);
  });

  it("preserves non-tokenizable objects as raw nodes", () => {
    const value = { foo: "bar" };
    const ast = parseRichMessage(value);
    expect(ast).toEqual([
      {
        type: "raw",
        value,
      },
    ]);
  });

  it("returns empty AST for null or undefined", () => {
    expect(parseRichMessage(null)).toEqual([]);
    expect(parseRichMessage(undefined as any)).toEqual([]);
  });
});
