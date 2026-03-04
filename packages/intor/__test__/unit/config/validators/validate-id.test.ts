import { describe, it, expect } from "vitest";
import { validateId } from "../../../../src/config/validators/validate-id";
import { IntorError, INTOR_ERROR_CODE } from "../../../../src/core";

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
      expect(e.code).toBe(INTOR_ERROR_CODE.CONFIG_INVALID_ID);
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
