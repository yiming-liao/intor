/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { validateSupportedLocales } from "@/config/validators/validate-supported-locales";
import { IntorError, IntorErrorCode } from "@/core";

describe("validateSupportedLocales", () => {
  const ID = "test";

  it("throws if supportedLocales is undefined", () => {
    expect(() => validateSupportedLocales(ID, undefined as any)).toThrowError(
      IntorError,
    );
  });

  it("throws if supportedLocales is an empty array", () => {
    expect(() => validateSupportedLocales(ID, [])).toThrowError(IntorError);
  });

  it("throws IntorError with correct error code when supportedLocales is missing", () => {
    try {
      validateSupportedLocales(ID, undefined as any);
    } catch (error) {
      expect(error).toBeInstanceOf(IntorError);
      const e = error as IntorError;
      expect(e.code).toBe(IntorErrorCode.MISSING_SUPPORTED_LOCALES);
      expect(e.message).toContain("supportedLocales");
    }
  });

  it("returns supportedLocales when provided", () => {
    const supportedLocales = ["en", "zh-TW"];
    const result = validateSupportedLocales(ID, supportedLocales);
    expect(result).toBe(supportedLocales); // reference equality is intentional
  });
});
