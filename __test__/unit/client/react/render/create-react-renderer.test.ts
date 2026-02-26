/* eslint-disable @typescript-eslint/no-explicit-any */
// @vitest-environment jsdom

import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { createReactRenderer } from "../../../../../src/client/react/render/create-react-renderer";

describe("createReactRenderer", () => {
  it("renders text nodes directly", () => {
    const renderer = createReactRenderer();
    expect(renderer.text("hello")).toBe("hello");
  });

  it("renders raw values directly", () => {
    const renderer = createReactRenderer();
    const node = React.createElement("span", null, "raw");
    expect(renderer.raw(node as any)).toBe(node);
  });

  it("uses custom function tag renderer when provided", () => {
    const customNode = React.createElement("b", null, "custom");
    const mockRenderer = vi.fn().mockReturnValue(customNode);
    const renderer = createReactRenderer({
      strong: mockRenderer,
    });
    const result = renderer.tag("strong", {}, ["child"]);
    expect(mockRenderer).toHaveBeenCalledWith(["child"]);
    expect(result).toBe(customNode);
  });

  it("uses custom element tag renderer when provided", () => {
    const element = React.createElement("i", null, "static");
    const renderer = createReactRenderer({
      em: element,
    });
    const result = renderer.tag("em", {}, ["ignored"]);
    expect(result).toBe(element);
  });

  it("falls back to native React element when no custom renderer exists", () => {
    const renderer = createReactRenderer();
    const result = renderer.tag("div", {}, ["hello"]);
    expect(React.isValidElement(result)).toBe(true);
    expect((result as any).type).toBe("div");
    expect((result as any).props.children).toBe("hello");
  });
});
