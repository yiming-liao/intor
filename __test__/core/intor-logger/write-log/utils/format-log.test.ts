import { LEVEL_COLOR_CODE } from "../../../../../src/intor/core/intor-logger/intor-logger-constants";
import { formatLog } from "../../../../../src/intor/core/intor-logger/write-log/utils/format-log";

jest.mock(
  "../../../../../src/intor/core/intor-logger/write-log/utils/format-timestamp",
  () => ({
    formatTimestamp: jest.fn().mockReturnValue("12:12:12"),
  }),
);

describe("formatLog", () => {
  it("should format the log message correctly without color", () => {
    const log = formatLog({
      id: "1",
      level: "info",
      message: "Test message",
      isUseColor: false,
    });

    expect(log).toContain("[12:12:12]");
    expect(log).toContain("[1]");
    expect(log).toContain("[INFO]");
    expect(log).toContain("• Test message");
  });

  it("should format the log message correctly with color", () => {
    const log = formatLog({
      id: "1",
      level: "info",
      message: "Test message",
      isUseColor: true,
    });

    expect(log).toContain("\x1b[38;5;245m[12:12:12]\x1b[0m"); // timestamp
    expect(log).toContain("[1]");
    expect(log).toContain("\x1b[38;5;34m[INFO] \x1b[0m");
    expect(log).toContain("• Test message");
  });

  it("should apply the correct color based on level", () => {
    const logError = formatLog({
      id: "1",
      level: "error",
      message: "Error message",
      isUseColor: true,
    });

    expect(logError).toContain(`\x1b[38;5;${LEVEL_COLOR_CODE.error}m[ERROR]`);

    const logWarn = formatLog({
      id: "1",
      level: "warn",
      message: "Warning message",
      isUseColor: true,
    });

    expect(logWarn).toContain(
      `\x1b[38;5;${LEVEL_COLOR_CODE.warn}m[WARN] \x1b[0m`,
    );
  });

  it("should include the prefix when provided", () => {
    const log = formatLog({
      id: "1",
      level: "info",
      message: "Test message",
      prefix: "moduleA",
      isUseColor: true,
    });

    expect(log).toContain("(moduleA) ");
  });

  it("should not include the prefix when not provided", () => {
    const log = formatLog({
      id: "1",
      level: "info",
      message: "Test message",
      isUseColor: true,
    });

    expect(log).not.toMatch(/\(.*\)/);
  });

  it("should use default color code when level is not defined in LEVEL_COLOR_CODE", () => {
    const log = formatLog({
      id: "1",
      level: "none" as unknown as "info",
      message: "Test message",
      isUseColor: true,
    });

    expect(log).toContain(`\x1b[38;5;15m[NONE] \x1b[0m`);
  });
});
