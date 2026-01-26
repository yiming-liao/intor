import { describe, it, expect } from "vitest";
import { renderAttributes } from "@/core/render/utils/render-attributes";

describe("renderAttributes", () => {
  it("returns empty string when attributes is undefined", () => {
    expect(renderAttributes()).toBe("");
  });

  it("renders string attributes", () => {
    expect(
      renderAttributes({
        class: "btn",
        id: "submit",
      }),
    ).toBe(' class="btn" id="submit"');
  });

  it("renders number attributes", () => {
    expect(
      renderAttributes({
        tabindex: 0,
        width: 100,
      }),
    ).toBe(' tabindex="0" width="100"');
  });

  it("renders boolean attributes correctly", () => {
    expect(
      renderAttributes({
        disabled: true,
        readonly: true,
      }),
    ).toBe(" disabled readonly");
  });

  it("serializes false boolean attributes as string values", () => {
    expect(
      renderAttributes({
        disabled: false,
        hidden: false,
      }),
    ).toBe(' disabled="false" hidden="false"');
  });

  it("omits null and undefined attributes", () => {
    expect(
      renderAttributes({
        title: null,
        alt: undefined,
      }),
    ).toBe("");
  });

  it("escapes attribute values", () => {
    expect(
      renderAttributes({
        title: 'hello "world" <script>',
      }),
    ).toBe(' title="hello &quot;world&quot; &lt;script&gt;"');
  });

  it("renders mixed attribute types together", () => {
    expect(
      renderAttributes({
        id: "main",
        hidden: false,
        disabled: true,
        tabindex: 0,
        title: "Hello <World>",
      }),
    ).toBe(
      ' id="main" hidden="false" disabled tabindex="0" title="Hello &lt;World&gt;"',
    );
  });

  it("preserves attribute order based on object insertion order", () => {
    const attrs = {
      a: "1",
      b: "2",
      c: "3",
    };
    expect(renderAttributes(attrs)).toBe(' a="1" b="2" c="3"');
  });
});
