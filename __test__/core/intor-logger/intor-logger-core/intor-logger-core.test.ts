import type { LogLevel } from "../../../../src/intor/core/intor-logger/intor-logger-types";
import {
  DEFAULT_LOG_LEVEL,
  LOG_LEVEL_PRIORITY,
} from "../../../../src/intor/core/intor-logger/intor-logger-constants";
import { IntorLoggerCore } from "../../../../src/intor/core/intor-logger/intor-logger-core/intor-logger-core";

describe("IntorLoggerCore", () => {
  let logger: IntorLoggerCore;

  beforeEach(() => {
    logger = new IntorLoggerCore("testLogger");
  });

  it("should initialize with default log level", () => {
    expect(logger.level).toBe(DEFAULT_LOG_LEVEL);
  });

  it("should set a new log level", () => {
    logger.setLevel("debug");
    expect(logger.level).toBe("debug");
  });

  it("should reset to the initial log level", () => {
    logger.setLevel("debug");
    logger.resetLevel();
    expect(logger.level).toBe(DEFAULT_LOG_LEVEL);
  });

  it("should return true for loggable level", () => {
    logger.setLevel("warn");
    expect(logger.shouldLog("error")).toBe(true);
    expect(logger.shouldLog("warn")).toBe(true);
    expect(logger.shouldLog("info")).toBe(false);
  });

  it("should throw error for invalid log level", () => {
    expect(() => logger.setLevel("invalidLevel" as LogLevel)).toThrowError(
      "Invalid log level: invalidLevel",
    );
    expect(() =>
      IntorLoggerCore.assertValidLevel("invalidLevel" as LogLevel),
    ).toThrowError("Invalid log level: invalidLevel");
  });

  it("should check log level validation correctly", () => {
    Object.keys(LOG_LEVEL_PRIORITY).forEach((level) => {
      expect(() =>
        IntorLoggerCore.assertValidLevel(level as LogLevel),
      ).not.toThrow();
    });

    expect(() =>
      IntorLoggerCore.assertValidLevel("nonExistingLevel" as LogLevel),
    ).toThrow("Invalid log level: nonExistingLevel");
  });

  it("should log correctly based on priority", () => {
    logger.setLevel("warn");

    expect(logger.shouldLog("error")).toBe(true);
    expect(logger.shouldLog("warn")).toBe(true);
    expect(logger.shouldLog("info")).toBe(false);
    expect(logger.shouldLog("debug")).toBe(false);
  });
  it("should initialize with provided valid log level", () => {
    const customLogger = new IntorLoggerCore("custom", "error");
    expect(customLogger.level).toBe("error");
  });

  it("should throw when initialized with invalid log level", () => {
    expect(
      () => new IntorLoggerCore("invalid", "notALevel" as LogLevel),
    ).toThrow("Invalid log level: notALevel");
  });
});
