import { describe, it, expect } from "vitest";
import { parseCookieHeader } from "@/core";

describe("parseCookieHeader", () => {
  it("returns empty object when header is undefined", () => {
    expect(parseCookieHeader(undefined)).toEqual({});
  });

  it("returns empty object when header is empty string", () => {
    expect(parseCookieHeader("")).toEqual({});
  });

  it("parses a single cookie", () => {
    const result = parseCookieHeader("locale=en-US");
    expect(result).toEqual({ locale: "en-US" });
  });

  it("parses multiple cookies", () => {
    const result = parseCookieHeader("a=1; b=2; c=3");
    expect(result).toEqual({
      a: "1",
      b: "2",
      c: "3",
    });
  });

  it("trims whitespace around keys", () => {
    const result = parseCookieHeader("  foo =bar; baz= qux ");
    expect(result).toEqual({
      foo: "bar",
      baz: "qux",
    });
  });

  it("decodes encoded cookie values", () => {
    const result = parseCookieHeader("locale=zh%2DTW");
    expect(result).toEqual({
      locale: "zh-TW",
    });
  });

  it("ignores malformed cookie pairs", () => {
    const result = parseCookieHeader("a=1; invalid; b=2");
    expect(result).toEqual({
      a: "1",
      b: "2",
    });
  });

  it("uses the last value when cookie keys are duplicated", () => {
    const result = parseCookieHeader("a=1; a=2");
    expect(result).toEqual({
      a: "2",
    });
  });

  it("never throws on unexpected input", () => {
    expect(() => parseCookieHeader(";;;==;foo=bar")).not.toThrow();
  });
});
