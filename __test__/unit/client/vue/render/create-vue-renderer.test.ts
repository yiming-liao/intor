import { describe, it, expect, vi } from "vitest";
import { h } from "vue";
import { createVueRenderer } from "../../../../../src/client/vue/render/create-vue-renderer";

describe("createVueRenderer", () => {
  it("renders text nodes directly", () => {
    const renderer = createVueRenderer();
    expect(renderer.text("hello")).toBe("hello");
  });

  it("renders raw values directly", () => {
    const renderer = createVueRenderer();
    const vnode = h("span", null, "raw");
    expect(renderer.raw(vnode as any)).toBe(vnode);
  });

  it("uses custom function tag renderer when provided", () => {
    const customVNode = h("b", null, "custom");
    const mockRenderer = vi.fn().mockReturnValue(customVNode);
    const renderer = createVueRenderer({
      strong: mockRenderer,
    });
    const result = renderer.tag("strong", {}, ["child"]);
    expect(mockRenderer).toHaveBeenCalledWith(["child"]);
    expect(result).toBe(customVNode);
  });

  it("uses custom element tag renderer when provided", () => {
    const staticVNode = h("i", null, "static");
    const renderer = createVueRenderer({
      em: staticVNode,
    });
    const result = renderer.tag("em", {}, ["ignored"]);
    expect(result).toBe(staticVNode);
  });

  it("falls back to native Vue element when no custom renderer exists", () => {
    const renderer = createVueRenderer();
    const result = renderer.tag("div", {}, ["hello"]);
    expect(result).toBeTruthy();
    expect((result as any).type).toBe("div");
    expect((result as any).children).toEqual(["hello"]);
  });
});
