import { describe, it, expect } from "vitest";
import { normalizePathname } from "../../../../../src/core/utils/normalizers/normalize-pathname";

describe("normalizePathname", () => {
  it("should normalize a pathname with multiple slashes", () => {
    expect(normalizePathname("/foo///bar//baz/")).toBe("/foo/bar/baz");
  });

  it("should remove empty segments", () => {
    expect(normalizePathname("foo//bar/baz/")).toBe("/foo/bar/baz");
  });

  it("should ensure a leading slash", () => {
    expect(normalizePathname("foo/bar/baz")).toBe("/foo/bar/baz");
  });

  it("should remove trailing slashes", () => {
    expect(normalizePathname("/foo/bar/baz/")).toBe("/foo/bar/baz");
  });

  it("should handle a pathname that is already normalized", () => {
    expect(normalizePathname("/foo/bar/baz")).toBe("/foo/bar/baz");
  });

  it("should handle an empty pathname", () => {
    expect(normalizePathname("")).toBe("/");
  });

  it("should trim leading and trailing spaces", () => {
    expect(normalizePathname("  /foo/bar/  ")).toBe("/foo/bar");
  });

  it("should handle only slashes correctly", () => {
    expect(normalizePathname("////")).toBe("/");
  });

  it("should handle single segment paths", () => {
    expect(normalizePathname("/foo/")).toBe("/foo");
  });

  it("should handle paths with only slashes and empty segments", () => {
    expect(normalizePathname("///foo///bar///")).toBe("/foo/bar");
  });

  it("should handle whitespace mixed with slashes", () => {
    expect(normalizePathname("  ///foo///bar//baz///  ")).toBe("/foo/bar/baz");
  });

  it("should handle non-ASCII characters and symbols", () => {
    expect(normalizePathname("/你好///世界//!@#$/")).toBe("/你好/世界/!@#$");
  });

  it("should handle single-character non-slash input", () => {
    expect(normalizePathname("a")).toBe("/a");
  });

  it("should return '/' for only whitespace", () => {
    expect(normalizePathname("    ")).toBe("/");
  });

  it("should throw TypeError for non-string input", () => {
    // @ts-expect-error: deliberately passing invalid type
    expect(() => normalizePathname(null)).toThrow(TypeError);
  });

  it("should remove the leading slash if the option is set", () => {
    expect(normalizePathname("/foo/bar", { removeLeadingSlash: true })).toBe(
      "foo/bar",
    );
  });

  it("should not remove the leading slash if the option is not set", () => {
    expect(normalizePathname("/foo/bar", { removeLeadingSlash: false })).toBe(
      "/foo/bar",
    );
  });

  it("should normalize and remove the leading slash if the option is set", () => {
    expect(
      normalizePathname("/foo///bar//baz/", { removeLeadingSlash: true }),
    ).toBe("foo/bar/baz");
  });

  it("should return '/' for empty pathname with removeLeadingSlash option", () => {
    expect(normalizePathname("", { removeLeadingSlash: true })).toBe("/");
  });

  it("should handle leading slash in already normalized pathname with removeLeadingSlash", () => {
    expect(
      normalizePathname("/foo/bar/baz", { removeLeadingSlash: true }),
    ).toBe("foo/bar/baz");
  });
});
