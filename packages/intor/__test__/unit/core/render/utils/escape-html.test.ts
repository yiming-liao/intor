import { describe, it, expect } from "vitest";
import { escapeHtml } from "../../../../../src/core/render/utils/escape-html";

describe("escapeHtml", () => {
  it("escapes basic HTML special characters", () => {
    expect(escapeHtml("<div>")).toBe("&lt;div&gt;");
    expect(escapeHtml("&")).toBe("&amp;");
    expect(escapeHtml('"')).toBe("&quot;");
    expect(escapeHtml("'")).toBe("&#39;");
  });

  it("escapes mixed content correctly", () => {
    expect(escapeHtml(`Tom & Jerry <script>alert("x")</script>`)).toBe(
      "Tom &amp; Jerry &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
    );
  });

  it("does not double-escape already escaped content", () => {
    // Intentionally documents behavior:
    // escapeHtml is NOT a sanitizer or idempotent function.
    expect(escapeHtml("&amp;")).toBe("&amp;amp;");
  });

  it("handles empty string", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("handles strings without escapable characters", () => {
    expect(escapeHtml("hello world")).toBe("hello world");
  });
});
