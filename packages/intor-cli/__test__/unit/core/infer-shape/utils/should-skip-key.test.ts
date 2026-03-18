import { describe, it, expect } from "vitest";
import { shouldSkipKey } from "../../../../../src/core/infer-shape/utils/should-skip-key";

describe("shouldSkipKey", () => {
  it("skips internal intor metadata keys", () => {
    expect(shouldSkipKey("__intor_kind", "messages")).toBe(true);
    expect(shouldSkipKey("__intor_flags", "replacements")).toBe(true);
    expect(shouldSkipKey("__intor_anything", "rich")).toBe(true);
  });

  it("allows content key in messages mode", () => {
    expect(shouldSkipKey("content", "messages")).toBe(false);
  });

  it("skips content key in non-messages modes", () => {
    expect(shouldSkipKey("content", "replacements")).toBe(true);
    expect(shouldSkipKey("content", "rich")).toBe(true);
  });

  it("does not skip normal keys", () => {
    expect(shouldSkipKey("greeting", "messages")).toBe(false);
    expect(shouldSkipKey("notification", "replacements")).toBe(false);
    expect(shouldSkipKey("title", "rich")).toBe(false);
  });
});
