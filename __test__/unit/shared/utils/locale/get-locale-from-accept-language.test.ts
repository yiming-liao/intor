/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { getLocaleFromAcceptLanguage } from "@/core/utils/locale/get-locale-from-accept-language";

describe("getLocaleFromAcceptLanguage", () => {
  it("should return undefined when header is missing", () => {
    const result = getLocaleFromAcceptLanguage(
      { supportedLocales: ["en", "zh"] } as any,
      undefined,
    );
    expect(result).toBeUndefined();
  });

  it("should return undefined when supportedLocales is missing", () => {
    const result = getLocaleFromAcceptLanguage({} as any, "en-US,en;q=0.9");
    expect(result).toBeUndefined();
  });

  it("should return undefined when supportedLocales is empty", () => {
    const result = getLocaleFromAcceptLanguage(
      { supportedLocales: [] } as any,
      "en-US,en;q=0.9",
    );
    expect(result).toBeUndefined();
  });

  it("should return the highest q-value locale that is supported", () => {
    const result = getLocaleFromAcceptLanguage(
      { supportedLocales: ["en-US", "zh-TW"] } as any,
      "en-US;q=0.5, zh-TW;q=0.9",
    );
    expect(result).toBe("zh-TW");
  });

  it("should default q-value to 1 when not provided", () => {
    const result = getLocaleFromAcceptLanguage(
      { supportedLocales: ["en", "ja"] } as any,
      "ja, en;q=0.5",
    );
    expect(result).toBe("ja");
  });

  it("should skip languages not in supportedLocales", () => {
    const result = getLocaleFromAcceptLanguage(
      { supportedLocales: ["en", "zh"] } as any,
      "fr, en;q=0.8",
    );
    expect(result).toBe("en");
  });

  it("should treat invalid q-values as q = 0", () => {
    const result = getLocaleFromAcceptLanguage(
      { supportedLocales: ["en", "zh"] } as any,
      "en;q=oops, zh;q=0.2",
    );
    expect(result).toBe("zh");
  });

  it("should return undefined if none of the preferred languages match", () => {
    const result = getLocaleFromAcceptLanguage(
      { supportedLocales: ["en", "ja"] } as any,
      "fr, de;q=0.7",
    );
    expect(result).toBeUndefined();
  });

  it("should correctly trim whitespace", () => {
    const result = getLocaleFromAcceptLanguage(
      { supportedLocales: ["en-US", "zh-TW"] } as any,
      "   en-US  , zh-TW;q=0.8  ",
    );
    expect(result).toBe("en-US");
  });
});
