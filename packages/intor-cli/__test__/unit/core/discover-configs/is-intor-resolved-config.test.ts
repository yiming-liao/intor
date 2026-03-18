import { describe, it, expect } from "vitest";
import { isIntorResolvedConfig } from "../../../../src/core/discover-configs/is-intor-resolved-config";

describe("isIntorResolvedConfig", () => {
  it("returns true for a valid Intor resolved config shape", () => {
    const config = {
      id: "i18n",
      defaultLocale: "en",
      supportedLocales: ["en", "zh-TW"],
    };
    expect(isIntorResolvedConfig(config)).toBe(true);
  });

  it("returns false for non-object values", () => {
    expect(isIntorResolvedConfig(null)).toBe(false);
    expect(isIntorResolvedConfig(undefined)).toBe(false);
    expect(isIntorResolvedConfig("string")).toBe(false);
    expect(isIntorResolvedConfig(123)).toBe(false);
    expect(isIntorResolvedConfig(true)).toBe(false);
  });

  it("returns false when id is missing or invalid", () => {
    expect(
      isIntorResolvedConfig({
        defaultLocale: "en",
        supportedLocales: ["en"],
      }),
    ).toBe(false);
    expect(
      isIntorResolvedConfig({
        id: 123,
        defaultLocale: "en",
        supportedLocales: ["en"],
      }),
    ).toBe(false);
  });

  it("returns false when defaultLocale is missing or invalid", () => {
    expect(
      isIntorResolvedConfig({
        id: "i18n",
        supportedLocales: ["en"],
      }),
    ).toBe(false);
    expect(
      isIntorResolvedConfig({
        id: "i18n",
        defaultLocale: 123,
        supportedLocales: ["en"],
      }),
    ).toBe(false);
  });

  it("returns false when supportedLocales is missing or invalid", () => {
    expect(
      isIntorResolvedConfig({
        id: "i18n",
        defaultLocale: "en",
      }),
    ).toBe(false);
    expect(
      isIntorResolvedConfig({
        id: "i18n",
        defaultLocale: "en",
        supportedLocales: "en",
      }),
    ).toBe(false);
  });
});
