import { describe, it, expect } from "vitest";
import { buildAST } from "../../../src/message/ast";
import { tokenize } from "../../../src/message/tokenize";

describe("buildAST", () => {
  it("builds AST from plain text", () => {
    const ast = buildAST(tokenize("Hello world"));
    expect(ast).toEqual([{ type: "text", value: "Hello world" }]);
  });

  it("builds AST with a single tag", () => {
    const ast = buildAST(tokenize("Hello <b>world</b>"));
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

  it("builds nested tag structure", () => {
    const ast = buildAST(tokenize("Build <b>your <i>future</i></b> today"));
    expect(ast).toEqual([
      { type: "text", value: "Build " },
      {
        type: "tag",
        name: "b",
        attributes: {},
        children: [
          { type: "text", value: "your " },
          {
            type: "tag",
            name: "i",
            attributes: {},
            children: [{ type: "text", value: "future" }],
          },
        ],
      },
      { type: "text", value: " today" },
    ]);
  });

  it("passes attributes from tag-open tokens into AST", () => {
    const ast = buildAST(
      tokenize('<link id="x" href="/pricing">Pricing</link>'),
    );
    expect(ast).toEqual([
      {
        type: "tag",
        name: "link",
        attributes: {
          id: "x",
          href: "/pricing",
        },
        children: [{ type: "text", value: "Pricing" }],
      },
    ]);
  });

  it("throws on unmatched closing tag", () => {
    expect(() => buildAST(tokenize("Hello </b>"))).toThrow(
      /Unmatched closing tag/,
    );
  });

  it("throws on incorrect nesting order", () => {
    expect(() => buildAST(tokenize("<b><i>text</b></i>"))).toThrow(
      /Unmatched closing tag/,
    );
  });

  it("throws on unclosed tag", () => {
    expect(() => buildAST(tokenize("<b>text"))).toThrow(
      /Unclosed tag detected/,
    );
  });

  it("handles adjacent tags correctly", () => {
    const ast = buildAST(tokenize("<b>Bold</b><i>Italic</i>"));
    expect(ast).toEqual([
      {
        type: "tag",
        name: "b",
        attributes: {},
        children: [{ type: "text", value: "Bold" }],
      },
      {
        type: "tag",
        name: "i",
        attributes: {},
        children: [{ type: "text", value: "Italic" }],
      },
    ]);
  });

  it("handles empty input", () => {
    const ast = buildAST(tokenize(""));
    expect(ast).toEqual([]);
  });
});
