import { describe, it, expect } from "vitest";
import { normalizeLocale } from "@/shared/utils";

describe("normalizeLocale", () => {
  it("returns undefined when no locale is provided", () => {
    const result = normalizeLocale("", ["en", "zh-TW"] as const);
    expect(result).toBeUndefined();
  });

  it("returns undefined when supportedLocales is empty", () => {
    const result = normalizeLocale("en", [] as const);
    expect(result).toBeUndefined();
  });

  it("returns exact canonical match", () => {
    const result = normalizeLocale("en-US", ["en-US", "zh-TW"] as const);
    expect(result).toBe("en-US");
  });

  it("matches case-insensitive inputs", () => {
    const result = normalizeLocale("EN-us", ["en-US"] as const);
    expect(result).toBe("en-US");
  });

  it("matches base language to first supported variant", () => {
    const result = normalizeLocale("en", ["en-GB", "en-US"] as const);
    // 依照 map 建立順序：en-GB 會先被加入
    expect(result).toBe("en-GB");
  });

  it("returns undefined when no match is found", () => {
    const result = normalizeLocale("jp", ["en", "zh"] as const);
    expect(result).toBeUndefined();
  });

  it("normalizes supported locales as well", () => {
    const result = normalizeLocale("zh-hant", ["zh-Hant-TW"] as const);
    expect(result).toBe("zh-Hant-TW");
  });

  it("catches invalid locale input gracefully", () => {
    // Intl.getCanonicalLocales throws on invalid strings
    const result = normalizeLocale("not_a_locale", ["en"] as const);
    expect(result).toBeUndefined();
  });
});
