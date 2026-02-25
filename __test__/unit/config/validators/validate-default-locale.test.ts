import { describe, it, expect } from "vitest";
import { validateDefaultLocale } from "../../../../src/config/validators/validate-default-locale";
import { IntorError, IntorErrorCode } from "../../../../src/core";

describe("validateDefaultLocale", () => {
  const ID = "test";

  it("throws if defaultLocale is not included in supportedLocales", () => {
    const supportedLocaleSet = new Set(["zh", "ja"]);
    expect(() =>
      validateDefaultLocale(ID, "en", supportedLocaleSet),
    ).toThrowError(IntorError);
  });

  it("throws IntorError with correct error code when defaultLocale is unsupported", () => {
    const supportedLocaleSet = new Set(["zh", "ja"]);
    try {
      validateDefaultLocale(ID, "en", supportedLocaleSet);
    } catch (error) {
      expect(error).toBeInstanceOf(IntorError);
      const e = error as IntorError;
      expect(e.code).toBe(IntorErrorCode.UNSUPPORTED_DEFAULT_LOCALE);
      expect(e.message).toContain("defaultLocale");
    }
  });

  it("returns defaultLocale when it is included in supportedLocales", () => {
    const supportedLocaleSet = new Set(["en", "zh"]);
    const result = validateDefaultLocale(ID, "en", supportedLocaleSet);
    expect(result).toBe("en");
  });
});
