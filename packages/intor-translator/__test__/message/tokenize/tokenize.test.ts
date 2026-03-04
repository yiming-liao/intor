import { describe, it, expect } from "vitest";
import { tokenize } from "../../../src/message/tokenize/tokenize";

describe("tokenize (semantic behavior)", () => {
  it("tokenizes plain text", () => {
    const tokens = tokenize("Hello world");
    expect(tokens).toMatchObject([{ type: "text", value: "Hello world" }]);
  });

  it("tokenizes a simple tag without attributes", () => {
    const tokens = tokenize("Hello <b>world</b>");
    expect(tokens).toMatchObject([
      { type: "text", value: "Hello " },
      { type: "tag-open", name: "b", attributes: {} },
      { type: "text", value: "world" },
      { type: "tag-close", name: "b" },
    ]);
  });

  it("tokenizes a tag with attributes", () => {
    const tokens = tokenize('Go to <link id="pricing">Pricing</link>');
    expect(tokens).toMatchObject([
      { type: "text", value: "Go to " },
      { type: "tag-open", name: "link", attributes: { id: "pricing" } },
      { type: "text", value: "Pricing" },
      { type: "tag-close", name: "link" },
    ]);
  });

  it("supports multiple attributes", () => {
    const tokens = tokenize('<link id="x" href="/pricing">Pricing</link>');
    expect(tokens).toMatchObject([
      {
        type: "tag-open",
        name: "link",
        attributes: { id: "x", href: "/pricing" },
      },
      { type: "text", value: "Pricing" },
      { type: "tag-close", name: "link" },
    ]);
  });

  it("treats invalid attribute syntax as plain text for opening tag", () => {
    const tokens = tokenize("Hello <link id=x>world</link>");
    expect(tokens).toMatchObject([
      { type: "text", value: "Hello <link id=x>world" },
      { type: "tag-close", name: "link" },
    ]);
  });

  it("treats unknown tag formats as plain text", () => {
    const tokens = tokenize("Hello <link-123>world</link-123>");
    expect(tokens).toMatchObject([
      {
        type: "text",
        value: "Hello <link-123>world</link-123>",
      },
    ]);
  });

  it("handles adjacent tags correctly", () => {
    const tokens = tokenize("<b>Hello</b><i>World</i>");
    expect(tokens).toMatchObject([
      { type: "tag-open", name: "b", attributes: {} },
      { type: "text", value: "Hello" },
      { type: "tag-close", name: "b" },
      { type: "tag-open", name: "i", attributes: {} },
      { type: "text", value: "World" },
      { type: "tag-close", name: "i" },
    ]);
  });

  it("handles stray '<' characters as plain text", () => {
    const tokens = tokenize("1 < 2 and 3 > 2");
    expect(tokens).toMatchObject([{ type: "text", value: "1 < 2 and 3 > 2" }]);
  });

  it("returns an empty array for empty input", () => {
    const tokens = tokenize("");
    expect(tokens).toEqual([]);
  });
});

describe("tokenize (position tracking)", () => {
  it("records correct start positions relative to the source message", () => {
    const message = "Hi <b>you</b>";
    const tokens = tokenize(message);
    expect(tokens.map((t) => t.position)).toEqual([
      0, // "Hi "
      message.indexOf("<b>"), // <b>
      message.indexOf("you"), // "you"
      message.indexOf("</b>"), // </b>
    ]);
  });
});
