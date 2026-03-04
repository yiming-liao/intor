/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Renderer } from "../../src/message/render/types";
import { describe, it, expect } from "vitest";
import { renderRichMessage } from "../../src/message";

describe("renderRichMessage", () => {
  const renderer: Renderer<string> = {
    text: (value) => value,
    tag: (_name, _attrs, children) => children.join(""),
    raw: String,
  };

  it("renders a rich string message", () => {
    const output = renderRichMessage("Hello <b>world</b>", renderer);
    expect(output.join("")).toBe("Hello world");
  });

  it("renders nested semantic tags", () => {
    const output = renderRichMessage("<b><i>text</i></b>", renderer);
    expect(output.join("")).toBe("text");
  });

  it("renders primitive message values", () => {
    expect(renderRichMessage(123, renderer).join("")).toBe("123");
    expect(renderRichMessage(true, renderer).join("")).toBe("true");
  });

  it("renders array message values recursively", () => {
    const output = renderRichMessage(["Hello ", "<b>world</b>", "!"], renderer);
    expect(output.join("")).toBe("Hello world!");
  });

  it("renders non-tokenizable objects via raw renderer", () => {
    const output = renderRichMessage({ foo: "bar" }, renderer);
    expect(output).toEqual(["[object Object]"]);
  });

  it("returns empty output for null or undefined", () => {
    expect(renderRichMessage(null, renderer)).toEqual([]);
    expect(renderRichMessage(undefined as any, renderer)).toEqual([]);
  });
});
