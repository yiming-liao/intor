import { describe, it, expect, vi } from "vitest";
import { IntorError, INTOR_ERROR_CODE } from "../../../../src/core/error";

describe("IntorError", () => {
  it("should create an error with message and name", () => {
    const error = new IntorError({ message: "Something went wrong" });
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("IntorError");
    expect(error.message).toBe("Something went wrong");
  });

  it("should include id in the message if provided", () => {
    const error = new IntorError({
      message: "Missing locale",
      id: "LOCALE_001",
    });
    expect(error.message).toBe("[LOCALE_001] Missing locale");
    expect(error.id).toBe("LOCALE_001");
  });

  it("should include code if provided", () => {
    const error = new IntorError({
      message: "Missing default locale",
      code: INTOR_ERROR_CODE.CONFIG_INVALID_ID,
    });
    expect(error.code).toBe(INTOR_ERROR_CODE.CONFIG_INVALID_ID);
  });

  it("should preserve prototype chain", () => {
    const error = new IntorError({ message: "Test" });
    expect(error instanceof IntorError).toBe(true);
    expect(error instanceof Error).toBe(true);
  });

  it("should not include id in the message if id is undefined", () => {
    const error = new IntorError({
      message: "Fallback message only",
    });
    expect(error.message).toBe("Fallback message only");
    expect(error.id).toBeUndefined();
  });

  it("should not include id in the message if id is not provided", () => {
    const error = new IntorError({
      message: "Missing required locale",
    });
    expect(error.message).toBe("Missing required locale");
    expect(error.id).toBeUndefined();
  });

  it("should call Error.captureStackTrace when available", () => {
    const spy = vi.spyOn(Error, "captureStackTrace");
    new IntorError({ message: "Stack test" });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("should not throw if Error.captureStackTrace is unavailable", () => {
    const original = (Error as any).captureStackTrace;
    (Error as any).captureStackTrace = undefined;
    expect(() => {
      new IntorError({ message: "No captureStackTrace" });
    }).not.toThrow();
    (Error as any).captureStackTrace = original;
  });
});
