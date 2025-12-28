import type { IntorRawConfig } from "@/config";
import { describe, it, expect } from "vitest";
import { validateSupportedLocales } from "@/config/validators/validate-supported-locales";
import { IntorError, IntorErrorCode } from "@/core/error";

describe("validateSupportedLocales", () => {
  const configBase = {
    id: "TEST_ID",
    messages: { en: {}, zh: {} },
  };

  it("throws if loader is used but supportedLocales is missing", () => {
    expect(() =>
      validateSupportedLocales({
        ...configBase,
        loader: { some: "option" },
      } as unknown as IntorRawConfig),
    ).toThrowError(IntorError);

    try {
      validateSupportedLocales({
        ...configBase,
        loader: { some: "option" },
      } as unknown as IntorRawConfig);
    } catch (error) {
      expect(error).toBeInstanceOf(IntorError);
      const e = error as IntorError;
      expect(e.code).toBe(IntorErrorCode.MISSING_SUPPORTED_LOCALES);
      expect(e.message).toContain("supportedLocales");
    }
  });

  it("returns provided supportedLocales if given", () => {
    const supported = ["en", "zh"];
    const result = validateSupportedLocales({
      ...configBase,
      supportedLocales: supported,
    } as unknown as IntorRawConfig);
    expect(result).toEqual(supported);
  });

  it("infers supportedLocales from messages if not provided and loader is absent", () => {
    const result = validateSupportedLocales({
      ...configBase,
    } as unknown as IntorRawConfig);
    expect(result).toEqual(["en", "zh"]);
  });
});
