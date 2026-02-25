import { describe, it, expect } from "vitest";
import { getLocaleFromQuery } from "../../../../src/routing";

describe("getLocaleFromQuery", () => {
  it("returns undefined when query is undefined", () => {
    const result = getLocaleFromQuery(undefined, "locale");
    expect(result).toBeUndefined();
  });

  it("returns undefined when query parameter is missing", () => {
    const result = getLocaleFromQuery({}, "locale");
    expect(result).toBeUndefined();
  });

  it("extracts locale from query parameter", () => {
    const result = getLocaleFromQuery({ locale: "en" }, "locale");
    expect(result).toBe("en");
  });

  it("returns raw value without normalization", () => {
    const result = getLocaleFromQuery({ locale: "EN-us" }, "locale");
    expect(result).toBe("EN-us");
  });

  it("respects custom query key", () => {
    const result = getLocaleFromQuery({ lang: "en" }, "lang");
    expect(result).toBe("en");
  });
});
