import type { InferNode } from "../../../../../src/core/infer-shape";
import { describe, it, expect } from "vitest";
import { inferObject } from "../../../../../src/core/infer-shape/utils/infer-object";

describe("inferObject", () => {
  const inferChild = (value: unknown): InferNode => {
    if (typeof value === "string") {
      return { kind: "primitive", type: "string" };
    }
    if (typeof value === "object" && value !== null) {
      return { kind: "object", properties: {} };
    }
    return { kind: "none" };
  };

  it("aggregates inferred children into an object node", () => {
    const result = inferObject(
      { greeting: "hello", title: "world" },
      inferChild,
      "messages",
    );
    expect(result).toEqual({
      kind: "object",
      properties: {
        greeting: { kind: "primitive", type: "string" },
        title: { kind: "primitive", type: "string" },
      },
    });
  });

  it("skips internal intor metadata keys", () => {
    const result = inferObject(
      { greeting: "hello", __intor_kind: "markdown" },
      inferChild,
      "messages",
    );
    expect(result).toEqual({
      kind: "object",
      properties: { greeting: { kind: "primitive", type: "string" } },
    });
  });

  it("skips content key outside of messages mode", () => {
    const result = inferObject(
      { content: "markdown text", greeting: "hello" },
      inferChild,
      "replacements",
    );
    expect(result).toEqual({
      kind: "object",
      properties: { greeting: { kind: "primitive", type: "string" } },
    });
  });

  it("returns none if all children are skipped or non-semantic", () => {
    const result = inferObject(
      { __intor_kind: "markdown", content: "markdown text" },
      inferChild,
      "replacements",
    );
    expect(result).toEqual({ kind: "none" });
  });

  it("skips children inferred as none", () => {
    const inferChild = (value: unknown): InferNode => {
      if (value === "skip-me") return { kind: "none" };
      return { kind: "primitive", type: "string" };
    };
    const result = inferObject(
      { visible: "ok", hidden: "skip-me" },
      inferChild,
      "messages",
    );
    expect(result).toEqual({
      kind: "object",
      properties: { visible: { kind: "primitive", type: "string" } },
    });
  });
});
