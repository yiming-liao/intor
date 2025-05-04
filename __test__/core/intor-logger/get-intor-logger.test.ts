import { getIntorLogger } from "@/intor/core/intor-logger/get-intor-logger";
import { IntorLogger } from "@/intor/core/intor-logger/intor-logger";

// Mock IntorLogger constructor to test the logger creation
jest.mock("@/intor/core/intor-logger/intor-logger", () => {
  return {
    IntorLogger: jest.fn().mockImplementation((level: string, id: string) => {
      return {
        level,
        id,
        prefix: "",
        log: jest.fn(), // Mock log method
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      };
    }),
  };
});

describe("getIntorLogger", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new logger instance with the provided id and default level", () => {
    const loggerId = "testLogger";
    const logger = getIntorLogger(loggerId);

    // Assert that the logger was created with the correct level and id
    expect(IntorLogger).toHaveBeenCalledWith("warn", loggerId); // Default level is 'warn'
    expect(logger).toHaveProperty("id", loggerId);
    expect(logger).toHaveProperty("level", "warn");

    // Verify that the log method exists
    expect(logger.log).toBeDefined();
  });

  it("should create a new logger instance with a specified level", () => {
    const loggerId = "testLoggerWithLevel";
    const logger = getIntorLogger(loggerId, "info");

    // Assert that the logger was created with the correct level and id
    expect(IntorLogger).toHaveBeenCalledWith("info", loggerId); // Custom level 'info'
    expect(logger).toHaveProperty("id", loggerId);
    expect(logger).toHaveProperty("level", "info");
  });

  it("should return the same logger instance for the same id", () => {
    const loggerId = "sameLogger";
    const firstLogger = getIntorLogger(loggerId);
    const secondLogger = getIntorLogger(loggerId);

    // Assert that both loggers are the same instance
    expect(firstLogger).toBe(secondLogger);
  });

  it("should return different logger instances for different ids", () => {
    const firstLoggerId = "firstLogger";
    const secondLoggerId = "secondLogger";

    const firstLogger = getIntorLogger(firstLoggerId);
    const secondLogger = getIntorLogger(secondLoggerId);

    // Assert that the loggers are different instances
    expect(firstLogger).not.toBe(secondLogger);
  });

  it("should store and reuse logger instances in loggerMap", () => {
    const loggerId = "reuseLogger";
    const firstLogger = getIntorLogger(loggerId);
    const secondLogger = getIntorLogger(loggerId);

    // The first and second logger should refer to the same instance in the loggerMap
    expect(firstLogger).toBe(secondLogger);
  });

  it("should call the log method when log is invoked", () => {
    const loggerId = "testLoggerForLogMethod";
    const logger = getIntorLogger(loggerId);

    // Call the log method with a specific log level
    logger.log("info", "This is an info message");

    // Assert that log method was called with the correct arguments
    expect(logger.log).toHaveBeenCalledWith("info", "This is an info message");
  });
});
