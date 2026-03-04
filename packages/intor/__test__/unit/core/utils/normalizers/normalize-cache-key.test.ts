import { describe, it, expect } from "vitest";
import { normalizeCacheKey } from "../../../../../src/core/utils";

describe("normalizeCacheKey", () => {
  it("should return null when key is undefined", () => {
    expect(normalizeCacheKey()).toBeNull();
  });

  it("should return a plain string for simple string input", () => {
    expect(normalizeCacheKey("hello")).toBe("hello");
  });

  it("should return null for empty array input", () => {
    expect(normalizeCacheKey([])).toBeNull();
  });

  it("should normalize array values including null, undefined, boolean", () => {
    const result = normalizeCacheKey(["A", null, undefined, true, false, 123]);
    expect(result).toBe("A|__null|__undefined|__true|__false|123");
  });

  it("should strip invisible unicode and line breaks inside array elements", () => {
    const input = [" a\u200B ", " b\r\n"];
    const result = normalizeCacheKey(input);
    expect(result).toBe("a|b");
  });

  it("should sanitize and trim strings inside array keys", () => {
    const result = normalizeCacheKey(["  hello  ", " world\n"]);
    expect(result).toBe("hello|world");
  });

  it("should use custom delimiter when provided", () => {
    const result = normalizeCacheKey(["a", "b"], "_");
    expect(result).toBe("a_b");
  });

  it("should convert all non-string values to string inside arrays", () => {
    const result = normalizeCacheKey([1, 2, 3]);
    expect(result).toBe("1|2|3");
  });

  it("should handle boolean values outside arrays", () => {
    expect(normalizeCacheKey(true)).toBe("__true");
    expect(normalizeCacheKey(false)).toBe("__false");
  });
});
