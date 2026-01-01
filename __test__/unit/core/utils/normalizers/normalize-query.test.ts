import { describe, it, expect } from "vitest";
import { normalizeQuery } from "@/core/utils/normalizers/normalize-query";

describe("normalizeQuery", () => {
  it("keeps string values", () => {
    const input = {
      locale: "zh-TW",
      foo: "bar",
    };
    const result = normalizeQuery(input);
    expect(result).toEqual({
      locale: "zh-TW",
      foo: "bar",
    });
  });

  it("ignores non-string values", () => {
    const input = {
      locale: "en",
      page: 1,
      enabled: true,
      data: { a: 1 },
      list: ["a", "b"],
    };
    const result = normalizeQuery(input);
    expect(result).toEqual({
      locale: "en",
    });
  });

  it("returns an empty object when no string values exist", () => {
    const input = {
      count: 1,
      valid: false,
      items: ["a"],
    };
    const result = normalizeQuery(input);
    expect(result).toEqual({});
  });

  it("does not mutate the original query object", () => {
    const input = {
      locale: "en",
      page: 1,
    };
    const copy = { ...input };
    normalizeQuery(input);
    expect(input).toEqual(copy);
  });
});
