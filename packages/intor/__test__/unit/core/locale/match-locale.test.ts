import { describe, it, expect } from "vitest";
import { matchLocale } from "../../../../src/core/locale";

describe("matchLocale (strict script mode)", () => {
  // Defensive guards
  it("returns undefined when input or supportedLocales is invalid", () => {
    expect(matchLocale("", ["en"] as const)).toBeUndefined();
    expect(matchLocale("en", [] as const)).toBeUndefined();
  });

  // Exact canonical match
  it("returns exact canonical match (case-insensitive)", () => {
    expect(matchLocale("EN-us", ["en-US", "zh-TW"] as const)).toBe("en-US");
  });

  // Script-aware matching
  it("matches same language and script before language-only fallback", () => {
    expect(matchLocale("zh-Hans", ["zh-Hant-TW", "zh-Hans-CN"] as const)).toBe(
      "zh-Hans-CN",
    );
  });

  // Strict script: no cross-script fallback
  it("does not fallback across script boundaries", () => {
    expect(matchLocale("sr-Latn", ["sr-Cyrl"] as const)).toBeUndefined();
  });

  // Language-only fallback when candidate has no script
  it("falls back by base language when candidate has no script", () => {
    expect(matchLocale("en", ["en-GB", "en-US"] as const)).toBe("en-GB");
  });

  // Region should not block script match
  it("matches same script regardless of region", () => {
    expect(matchLocale("zh-Hant-HK", ["zh-Hant-TW"] as const)).toBe(
      "zh-Hant-TW",
    );
  });

  // Invalid input handling
  it("returns undefined for invalid locale input", () => {
    expect(matchLocale("not_a_locale", ["en"] as const)).toBeUndefined();
  });

  // Invalid supported entries are ignored
  it("ignores invalid supported locale entries", () => {
    expect(matchLocale("en", ["en", "not_a_locale"] as const)).toBe("en");
  });

  // Exact precedence
  it("prioritizes exact match over broader matches", () => {
    expect(
      matchLocale("zh-Hant-TW", ["zh-Hant-TW", "zh-Hant-HK"] as const),
    ).toBe("zh-Hant-TW");
  });

  // Does not cross language boundary
  it("does not match different language", () => {
    expect(matchLocale("en-US", ["fr-US"] as const)).toBeUndefined();
  });

  // Intl fallback robustness
  it("falls back to raw matching if Intl is unavailable", () => {
    const originalIntl = globalThis.Intl;
    // @ts-expect-error override for test
    globalThis.Intl = undefined;

    expect(matchLocale("en-US", ["en-US"] as const)).toBe("en-US");

    globalThis.Intl = originalIntl;
  });
});
