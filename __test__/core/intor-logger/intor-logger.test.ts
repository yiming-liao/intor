import type { LogLevel } from "../../../src/intor/core/intor-logger/intor-logger-types";
import type { LogMeta } from "../../../src/intor/core/intor-logger/write-log";
import type { WriteLogOptions } from "../../../src/intor/core/intor-logger/write-log/weite-log-types";
import { IntorLogger } from "../../../src/intor/core/intor-logger/intor-logger";
import { IntorLoggerCore } from "../../../src/intor/core/intor-logger/intor-logger-core/intor-logger-core";
import { writeLog } from "../../../src/intor/core/intor-logger/write-log/write-log";

jest.mock("../../../src/intor/core/intor-logger/write-log/write-log", () => ({
  writeLog: jest.fn(),
}));

describe("IntorLogger", () => {
  const loggerId = "test-logger";
  let core: IntorLoggerCore;

  beforeEach(() => {
    core = new IntorLoggerCore(loggerId, "info");
    (writeLog as jest.Mock).mockClear();
  });

  const defaultWriteLogOptions: WriteLogOptions = {
    isUseColor: true,
    metaDepth: 2,
  };

  it("should default to core.level if level not provided", () => {
    const logger = new IntorLogger(core);
    expect(logger["level"]).toBe("info");
  });

  it("should respect provided level, prefix, and writeLogOptions", () => {
    const logger = new IntorLogger(
      core,
      "error",
      "APP",
      defaultWriteLogOptions,
    );
    expect(logger["level"]).toBe("error");
    expect(logger["prefix"]).toBe("APP");
    expect(logger["writeLogOptions"]).toEqual(defaultWriteLogOptions);
  });

  it("should log when level is above or equal to current", () => {
    const logger = new IntorLogger(core, "info", "SYS", defaultWriteLogOptions);
    void logger.log("warn", "test message");

    expect(writeLog).toHaveBeenCalledWith({
      level: "warn",
      id: loggerId,
      prefix: "SYS",
      message: "test message",
      meta: undefined,
      writeLogOptions: defaultWriteLogOptions,
    });
  });

  it("should NOT log when level is below current", () => {
    const logger = new IntorLogger(core, "error");
    void logger.log("debug", "this should not log");

    expect(writeLog).not.toHaveBeenCalled();
  });

  it("should allow overriding prefix and writeLogOptions via log options", () => {
    const logger = new IntorLogger(
      core,
      "info",
      "DEFAULT",
      defaultWriteLogOptions,
    );
    const overrideOptions: WriteLogOptions = {
      isUseColor: false,
      borderWidth: 80,
      metaDepth: 5,
    };

    void logger.log("info", "override test", undefined, {
      prefix: "OVERRIDE",
      writeLogOptions: overrideOptions,
    });

    expect(writeLog).toHaveBeenCalledWith({
      level: "info",
      id: loggerId,
      prefix: "OVERRIDE",
      message: "override test",
      meta: undefined,
      writeLogOptions: overrideOptions,
    });
  });

  it("should log with meta of type object", () => {
    const logger = new IntorLogger(core, "debug");
    const meta: LogMeta = { userId: 123, role: "admin" };

    void logger.log("info", "with meta object", meta);

    expect(writeLog).toHaveBeenCalledWith(
      expect.objectContaining({
        meta,
      }),
    );
  });

  it("should log with meta of type Error", () => {
    const logger = new IntorLogger(core, "debug");
    const error = new Error("Something went wrong");

    void logger.log("error", "with error meta", error);

    expect(writeLog).toHaveBeenCalledWith(
      expect.objectContaining({
        meta: error,
      }),
    );
  });

  it("should throw on invalid log level", async () => {
    const logger = new IntorLogger(core);

    await expect(
      logger.log("invalid-level" as LogLevel, "bad level"),
    ).rejects.toThrow("Invalid log level: invalid-level");
  });

  it("child() should create a logger with overridden settings", () => {
    const logger = new IntorLogger(core, "info", "ROOT", {
      isUseColor: true,
      borderWidth: 0,
      metaDepth: 1,
    });

    const childLogger = logger.child({
      level: "debug",
      prefix: "CHILD",
      writeLogOptions: {
        isUseColor: false,
        borderWidth: 80,
        metaDepth: 3,
      },
    });

    expect(childLogger["level"]).toBe("debug");
    expect(childLogger["prefix"]).toBe("CHILD");
    expect(childLogger["writeLogOptions"]).toEqual({
      isUseColor: false,
      borderWidth: 80,
      metaDepth: 3,
    });

    const meta = { sessionId: "abc123" };
    void childLogger.log("info", "child log test", meta);

    expect(writeLog).toHaveBeenCalledWith({
      level: "info",
      id: loggerId,
      prefix: "CHILD",
      message: "child log test",
      meta,
      writeLogOptions: {
        isUseColor: false,
        borderWidth: 80,
        metaDepth: 3,
      },
    });
  });

  it("should log when level is above or equal to current", async () => {
    const logger = new IntorLogger(core, "info", "SYS");

    await logger.log("warn", "test message");

    expect(writeLog).toHaveBeenCalledWith({
      level: "warn",
      id: loggerId,
      prefix: "SYS",
      message: "test message",
      meta: undefined,
      writeLogOptions: {
        ...core.writeLogOptions,
        ...logger["writeLogOptions"], // Expect default options or passed options
      },
    });
  });

  it("should NOT log when level is below current", async () => {
    const logger = new IntorLogger(core, "error");

    await logger.log("debug", "this should not log");

    expect(writeLog).not.toHaveBeenCalled();
  });

  it("should allow overriding prefix and writeLogOptions via log options", async () => {
    const logger = new IntorLogger(core, "info", "DEFAULT");
    const overrideOptions: WriteLogOptions = {
      isUseColor: false,
      borderWidth: 80,
      metaDepth: 5,
    };

    await logger.log("info", "override test", undefined, {
      prefix: "OVERRIDE",
      writeLogOptions: overrideOptions,
    });

    expect(writeLog).toHaveBeenCalledWith({
      level: "info",
      id: loggerId,
      prefix: "OVERRIDE",
      message: "override test",
      meta: undefined,
      writeLogOptions: overrideOptions,
    });
  });

  it("should throw an error for invalid log level", async () => {
    const logger = new IntorLogger(core);

    await expect(
      logger.log("invalid-level" as LogLevel, "bad level"),
    ).rejects.toThrow("Invalid log level: invalid-level");
  });

  it("should throw an error if log level is invalid", async () => {
    const invalidLevel = "invalid-level" as LogLevel;
    const logger = new IntorLogger(core);

    await expect(logger.log(invalidLevel, "test message")).rejects.toThrow(
      "Invalid log level: invalid-level",
    );
  });

  it("should pass meta and writeLogOptions correctly", async () => {
    const logger = new IntorLogger(core, "debug");
    const meta: LogMeta = { userId: 123, role: "admin" };
    const writeLogOptions: WriteLogOptions = {
      isUseColor: true,
      metaDepth: 3,
    };

    await logger.log("debug", "message with meta and options", meta, {
      writeLogOptions,
    });

    expect(writeLog).toHaveBeenCalledWith(
      expect.objectContaining({
        meta,
        writeLogOptions,
      }),
    );
  });

  it("should create a child logger with default parameters when called without arguments", () => {
    const logger = new IntorLogger(core);

    const childLogger = logger.child(); // 這裡觸發 params === undefined

    expect(childLogger).toBeInstanceOf(IntorLogger);
  });
});
