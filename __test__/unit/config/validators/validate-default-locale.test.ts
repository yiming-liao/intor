import { describe, it, expect } from "vitest";
import { validateDefaultLocale } from "@/config/validators/validate-default-locale";
import { IntorError, IntorErrorCode } from "@/core/error";

describe("validateDefaultLocale", () => {
  const configBase = {
    id: "TEST_ID",
  };

  it("throws if defaultLocale is undefined", () => {
    expect(() =>
      // @ts-expect-error undefined
      validateDefaultLocale({ ...configBase, defaultLocale: undefined }, [
        "en",
        "zh",
      ]),
    ).toThrowError(IntorError);

    try {
      // @ts-expect-error undefined
      validateDefaultLocale({ ...configBase, defaultLocale: undefined }, [
        "en",
        "zh",
      ]);
    } catch (error) {
      expect(error).toBeInstanceOf(IntorError);
      const e = error as IntorError;
      expect(e.code).toBe(IntorErrorCode.MISSING_DEFAULT_LOCALE);
      expect(e.message).toContain("undefined");
    }
  });

  it("throws if defaultLocale is not in supportedLocales", () => {
    expect(() =>
      validateDefaultLocale({ ...configBase, defaultLocale: "fr" }, [
        "en",
        "zh",
      ]),
    ).toThrowError(IntorError);

    try {
      validateDefaultLocale({ ...configBase, defaultLocale: "fr" }, [
        "en",
        "zh",
      ]);
    } catch (error) {
      expect(error).toBeInstanceOf(IntorError);
      const e = error as IntorError;
      expect(e.code).toBe(IntorErrorCode.UNSUPPORTED_DEFAULT_LOCALE);
      expect(e.message).toContain("fr");
    }
  });

  it("returns defaultLocale if valid", () => {
    const result = validateDefaultLocale(
      { ...configBase, defaultLocale: "en" },
      ["en", "zh"],
    );
    expect(result).toBe("en");
  });
});
