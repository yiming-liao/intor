import { normalizeLocale } from "@/shared/utils/locale/normalize-locale";

describe("normalizeLocale", () => {
  const supportedLocales = ["en-US", "en-GB", "zh-TW", "fr", "es"];

  test("should return exact match when locale exists", () => {
    const result = normalizeLocale("en-US", supportedLocales);
    expect(result).toBe("en-US");
  });

  test("should return prefix match when locale is a prefix of a supported locale", () => {
    const result = normalizeLocale("en", supportedLocales);
    expect(result).toBe("en-US");
  });

  test("should return suffix match when supported locale is a prefix of the given locale", () => {
    const result = normalizeLocale("en-US", supportedLocales);
    expect(result).toBe("en-US");
  });

  test("should return undefined if no exact, prefix, or suffix match is found", () => {
    const result = normalizeLocale("de-DE", supportedLocales);
    expect(result).toBeUndefined();
  });

  test("should handle case-insensitive matching", () => {
    const result = normalizeLocale("EN-us", supportedLocales);
    expect(result).toBe("en-US");
  });

  test("should return undefined if no supported locales are provided", () => {
    const result = normalizeLocale("en-US");
    expect(result).toBeUndefined();
  });

  test("should return undefined if locale is an empty string", () => {
    const result = normalizeLocale("", supportedLocales);
    expect(result).toBeUndefined();
  });

  test("should handle multiple prefix matches and return first found match", () => {
    const result = normalizeLocale("en", ["en-GB", "en-US"]);
    expect(result).toBe("en-GB");
  });

  test("should return suffix match when supported locale is a suffix of the given locale", () => {
    const result = normalizeLocale("fr-CA", ["fr"]);
    expect(result).toBe("fr");
  });

  test("should return undefined if supportedLocales is an empty array", () => {
    const result = normalizeLocale("en-US", []);
    expect(result).toBeUndefined();
  });

  test("should return undefined for gibberish locale", () => {
    const result = normalizeLocale("xx-YY", supportedLocales);
    expect(result).toBeUndefined();
  });

  test("should ignore invalid supportedLocales entries", () => {
    const result = normalizeLocale("en-US", ["en-US", "invalid-locale"]);
    expect(result).toBe("en-US");
  });

  test("should prioritize exact match over base match", () => {
    const result = normalizeLocale("en-GB", ["en", "en-GB"]);
    expect(result).toBe("en-GB");
  });

  it("returns undefined if Intl.getCanonicalLocales throws", () => {
    const spy = jest
      .spyOn(Intl, "getCanonicalLocales")
      .mockImplementation(() => {
        throw new Error("Invalid locale");
      });

    const result = normalizeLocale("%%%invalid-locale%%%", ["en", "zh-TW"]);
    expect(result).toBeUndefined();

    spy.mockRestore();
  });

  it("returns undefined if locale string is not canonicalizable", () => {
    const spy = jest
      .spyOn(Intl, "getCanonicalLocales")
      .mockImplementation(() => []);

    const result = normalizeLocale("not-a-real-locale", ["en", "fr"]);
    expect(result).toBeUndefined();

    spy.mockRestore();
  });
});
