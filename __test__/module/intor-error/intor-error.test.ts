import { IntorError, IntorErrorCode } from "@/modules/intor-error";

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
      code: IntorErrorCode.MISSING_DEFAULT_LOCALE,
    });
    expect(error.code).toBe(IntorErrorCode.MISSING_DEFAULT_LOCALE);
  });

  it("should preserve prototype chain", () => {
    const error = new IntorError({ message: "Test" });
    expect(error instanceof IntorError).toBe(true);
    expect(error instanceof Error).toBe(true);
  });

  it("should not include id in the message if id is undefined", () => {
    const error = new IntorError({
      message: "Fallback message only",
      id: undefined,
    });
    expect(error.message).toBe("Fallback message only");
    expect(error.id).toBeUndefined();
  });

  it("should not include id in the message if id is undefined", () => {
    const error = new IntorError({
      message: "Fallback message only",
      id: undefined,
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
});
