/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { createHtmlRenderer } from "../../../../src/core";

describe("createHtmlRenderer", () => {
  it("escapes text nodes", () => {
    const r = createHtmlRenderer();
    expect(r.text("<script>")).toBe("&lt;script&gt;");
    expect(r.text("&")).toBe("&amp;");
  });

  it("uses custom tag renderer function", () => {
    const r = createHtmlRenderer({
      strong: (children) => `<b>${children.join("")}</b>`,
    });
    const result = r.tag("strong", {}, ["hello"]);
    expect(result).toBe("<b>hello</b>");
  });

  it("uses custom tag renderer string", () => {
    const r = createHtmlRenderer({
      br: "<br/>",
    });
    const result = r.tag("br", {}, []);
    expect(result).toBe("<br/>");
  });

  it("renders default HTML tag when no custom renderer provided", () => {
    const r = createHtmlRenderer();
    const result = r.tag("span", { class: "a", id: "x" }, ["hello"]);
    expect(result).toBe('<span class="a" id="x">hello</span>');
  });

  it("renders nullish raw values as empty string", () => {
    const r = createHtmlRenderer();
    expect(r.raw(null)).toBe("");
    expect(r.raw(undefined as any)).toBe("");
  });

  it("escapes string and number raw values", () => {
    const r = createHtmlRenderer();
    expect(r.raw("<a>" as any)).toBe("&lt;a&gt;");
    expect(r.raw(123)).toBe("123");
  });

  it("renders array raw values as escaped concatenated string", () => {
    const r = createHtmlRenderer();
    const result = r.raw(["<a>", 1, "&"]);
    expect(result).toBe("&lt;a&gt;1&amp;");
  });

  it("throws for unsupported raw value types", () => {
    const r = createHtmlRenderer();
    expect(() => r.raw({} as any)).toThrow(
      "[intor] HTML renderer cannot render raw non-primitive values.",
    );
  });
});
