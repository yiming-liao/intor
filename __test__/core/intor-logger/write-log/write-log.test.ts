import { LEVEL_COLOR_CODE } from "../../../../src/intor/core/intor-logger/intor-logger-constants";
import { writeLog } from "../../../../src/intor/core/intor-logger/write-log/write-log";

jest.mock(
  "../../../../src/intor/core/intor-logger/write-log/utils/format-timestamp",
  () => ({
    formatTimestamp: jest.fn().mockReturnValue("12:12:12"),
  }),
);

jest.mock(
  "../../../../src/intor/core/intor-logger/write-log/utils/print-meta",
  () => ({
    printMeta: jest.fn(),
  }),
);

const { printMeta } = jest.requireMock(
  "../../../../src/intor/core/intor-logger/write-log/utils/print-meta",
);

describe("writeLog", () => {
  global.console.error = jest.fn();
  global.console.info = jest.fn();

  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    printMeta.mockClear();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should print log with correct format and color", () => {
    writeLog({
      id: "1",
      level: "info",
      message: "Hello World",
      writeLogOptions: {
        isUseColor: true,
      },
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(`[12:12:12]`),
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        `\x1b[38;5;${LEVEL_COLOR_CODE.info}m[INFO] \x1b[0m`,
      ),
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("• Hello World"),
    );
  });

  it("should print log without color", () => {
    writeLog({
      id: "1",
      level: "warn",
      message: "Plain message",
      writeLogOptions: {
        isUseColor: false,
      },
    });

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("[WARN]"));
    expect(consoleSpy).not.toHaveBeenCalledWith();
  });

  it("should throw error when log level is invalid", () => {
    expect(() =>
      writeLog({
        id: "1",
        level: "unknown" as unknown as "info",
        message: "Invalid level",
      }),
    ).toThrow("[Intor Logger] Invalid log level: unknown");
  });

  it("should throw error when id or message is missing", () => {
    expect(() =>
      writeLog({
        id: "",
        level: "info",
        message: "no id",
      }),
    ).toThrow("[Intor Logger] Both message and id are required.");

    expect(() =>
      writeLog({
        id: "1",
        level: "info",
        message: "",
      }),
    ).toThrow("[Intor Logger] Both message and id are required.");
  });

  it("should skip when level is silent", () => {
    writeLog({
      id: "1",
      level: "silent",
      message: "This should not be logged",
    });

    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("should print borders if borderWidth is set", () => {
    writeLog({
      id: "1",
      level: "info",
      message: "With border",
      writeLogOptions: {
        borderWidth: 10,
      },
    });

    expect(consoleSpy).toHaveBeenCalledWith("──────────");
  });

  it("should print meta data if provided", () => {
    writeLog({
      id: "1",
      level: "error",
      message: "With meta",
      meta: { a: 123 },
    });

    expect(printMeta).toHaveBeenCalledWith({ a: 123 }, 2, true);
  });

  it("should use default values when writeLogOptions is not provided", () => {
    writeLog({
      id: "1",
      level: "info",
      message: "Log without options",
    });

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("[INFO]"));

    expect(consoleSpy).not.toHaveBeenCalledWith("──────────");
  });

  it("should throw an error if borderWidth is negative", () => {
    // Test when borderWidth is 0 (no error, no border)
    writeLog({
      id: "1",
      level: "info",
      message: "No border",
      writeLogOptions: {
        borderWidth: 0,
      },
    });

    // Check that console.log was not called with a border string
    expect(consoleSpy).not.toHaveBeenCalledWith("──────────");

    // Test when borderWidth is negative (should throw error)
    expect(() => {
      writeLog({
        id: "1",
        level: "info",
        message: "Negative border",
        writeLogOptions: {
          borderWidth: -1,
        },
      });
    }).toThrowError(
      "[Intor Logger] Invalid borderWidth value: -1. It must be a positive number.",
    );
  });

  it("should throw error when level is not a valid string", () => {
    expect(() =>
      writeLog({
        id: "1",
        level: 123 as unknown as "info",
        message: "Invalid level",
      }),
    ).toThrow("[Intor Logger] Invalid log level: 123");

    expect(() =>
      writeLog({
        id: "1",
        level: null as unknown as "info",
        message: "Invalid level",
      }),
    ).toThrow("[Intor Logger] Invalid log level: null");

    expect(() =>
      writeLog({
        id: "1",
        level: undefined as unknown as "info",
        message: "Invalid level",
      }),
    ).toThrow("[Intor Logger] Invalid log level: undefined");
  });

  it("should skip printing when level is silent", () => {
    writeLog({
      id: "1",
      level: "silent",
      message: "This should not be logged",
    });

    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
