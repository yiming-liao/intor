import { describe, it, expect } from "vitest";
import { validateId } from "@/config/validators/validate-id";
import { IntorError, IntorErrorCode } from "@/core";

describe("validateId", () => {
  it("throws if id is an empty string", () => {
    expect(() => validateId("")).toThrowError(IntorError);
  });

  it("throws if id contains only whitespace", () => {
    expect(() => validateId("   ")).toThrowError(IntorError);
  });

  it("throws IntorError with correct error code for invalid id", () => {
    try {
      validateId("   ");
    } catch (error) {
      expect(error).toBeInstanceOf(IntorError);
      const e = error as IntorError;
      expect(e.code).toBe(IntorErrorCode.INVALID_CONFIG_ID);
      expect(e.message).toContain("id");
    }
  });

  it("returns the id when it is a non-empty string", () => {
    const id = "my-app";
    const result = validateId(id);
    expect(result).toBe(id);
  });

  it("allows ids with surrounding whitespace (not trimmed)", () => {
    const id = " my-app ";
    const result = validateId(id);
    expect(result).toBe(id);
  });
});
