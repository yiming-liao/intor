import { describe, it, expect } from "vitest";
import { resolvePreferredLocale } from "@/shared/utils/locale/resolve-preferred-locale";

describe("resolvePreferredLocale", () => {
  it("should return undefined when header is missing", () => {
    const result = resolvePreferredLocale(undefined, ["en", "zh"]);
    expect(result).toBeUndefined();
  });

  it("should return undefined when supportedLocales is missing", () => {
    const result = resolvePreferredLocale("en-US,en;q=0.9");
    expect(result).toBeUndefined();
  });

  it("should return undefined when supportedLocales is empty", () => {
    const result = resolvePreferredLocale("en-US,en;q=0.9", []);
    expect(result).toBeUndefined();
  });

  it("should return the highest q-value locale that is supported", () => {
    const result = resolvePreferredLocale("en-US;q=0.5, zh-TW;q=0.9", [
      "en-US",
      "zh-TW",
    ]);
    expect(result).toBe("zh-TW");
  });

  it("should default q-value to 1 when not provided", () => {
    const result = resolvePreferredLocale("ja, en;q=0.5", ["en", "ja"]);
    expect(result).toBe("ja");
  });

  it("should skip languages not in supportedLocales", () => {
    const result = resolvePreferredLocale("fr, en;q=0.8", ["en", "zh"]);
    expect(result).toBe("en");
  });

  it("should treat invalid q-values as q = 0", () => {
    const result = resolvePreferredLocale("en;q=oops, zh;q=0.2", ["en", "zh"]);
    expect(result).toBe("zh");
  });

  it("should return undefined if none of the preferred languages match", () => {
    const result = resolvePreferredLocale("fr, de;q=0.7", ["en", "ja"]);
    expect(result).toBeUndefined();
  });

  it("should correctly trim whitespace", () => {
    const result = resolvePreferredLocale("   en-US  , zh-TW;q=0.8  ", [
      "en-US",
      "zh-TW",
    ]);
    expect(result).toBe("en-US");
  });
});
