import { IntorLogger } from "@/intor/core/intor-logger/intor-logger";

describe("IntorLogger", () => {
  let logger: IntorLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new IntorLogger("debug", "test-id", "test-file");
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should log debug message", () => {
    logger.debug("debug message");
    const callArgs = consoleSpy.mock.calls[0];
    expect(callArgs[0]).toContain("[DEBUG]");
  });

  it("should log info message", () => {
    logger.info("info message");
    const callArgs = consoleSpy.mock.calls[0];
    expect(callArgs[0]).toContain("[INFO]");
  });

  it("should log warn message", () => {
    logger.warn("warn message");
    const callArgs = consoleSpy.mock.calls[0];
    expect(callArgs[0]).toContain("[WARN]");
  });

  it("should log error message", () => {
    logger.error("error message");
    const callArgs = consoleSpy.mock.calls[0];
    expect(callArgs[0]).toContain("[ERROR]");
  });

  it("should not log when level is higher than configured", () => {
    logger.setLevel("error");
    logger.info("info message");
    expect(consoleSpy).not.toHaveBeenCalled(); // Ensures nothing is logged when level is too high
  });

  it("should include prefix and id in log", () => {
    logger.info("check prefix and id");
    expect(consoleSpy.mock.calls[0][0]).toContain("[test-id]");
    expect(consoleSpy.mock.calls[0][0]).toContain("[test-file]");
  });

  it("should log messages only for allowed levels", () => {
    logger.setLevel("warn");
    logger.debug("This should not be logged");
    expect(consoleSpy).not.toHaveBeenCalled();

    logger.warn("This should be logged");
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("should include meta in log if provided", () => {
    const meta = { key: "value" };
    logger.info("Info message with meta", meta);
    const callArgs = consoleSpy.mock.calls[0];
    expect(callArgs[1]).toEqual(meta); // Checking if meta is logged correctly
  });
});
