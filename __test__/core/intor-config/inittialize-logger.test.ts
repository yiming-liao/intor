import { DEFAULT_LOGGER_OPTIONS } from "../../../src/intor/constants/logger-options-constants";
import { initializeLogger } from "../../../src/intor/core/intor-config/initialize-logger";
import { resetLoggerFactory } from "../../../src/intor/core/intor-logger";

describe("initializeLogger", () => {
  const loggerId = "test-logger";

  afterEach(() => {
    resetLoggerFactory();
  });

  it("should create logger with default options when none provided", () => {
    const logger = initializeLogger({ id: loggerId, prefix: "test" });

    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.debug).toBe("function");
    expect(() => logger.info("hello", { some: "meta" })).not.toThrow();

    expect(logger[`level`]).toBe(DEFAULT_LOGGER_OPTIONS.level);
    expect(logger?.[`writeLogOptions`]?.metaDepth).toBe(
      DEFAULT_LOGGER_OPTIONS.metaDepth,
    );
    expect(logger?.[`writeLogOptions`]?.borderWidth).toBe(
      DEFAULT_LOGGER_OPTIONS.borderWidth,
    );
    expect(logger?.[`writeLogOptions`]?.isUseColor).toBe(
      DEFAULT_LOGGER_OPTIONS.isUseColor,
    );
  });

  it("should apply provided logger options", () => {
    const logger = initializeLogger({
      id: loggerId,
      prefix: "my-prefix",
      loggerOptions: {
        level: "debug",
        metaDepth: 5,
        borderWidth: 2,
        isUseColor: false,
      },
    });

    expect(logger).toBeDefined();
    expect(logger[`level`]).toBe("debug");
    expect(logger?.[`writeLogOptions`]?.metaDepth).toBe(5);
    expect(logger?.[`writeLogOptions`]?.borderWidth).toBe(2);
    expect(logger?.[`writeLogOptions`]?.isUseColor).toBe(false);
  });

  it("should return same logger for same id and prefix", () => {
    const loggerA = initializeLogger({ id: loggerId, prefix: "shared" });

    expect(loggerA).toEqual(
      expect.objectContaining({
        core: expect.objectContaining({
          id: "test-logger",
          level: "warn",
        }),
        writeLogOptions: expect.objectContaining({
          borderWidth: 0,
          isUseColor: true,
          metaDepth: 2,
        }),
        prefix: "shared",
      }),
    );
  });
});
