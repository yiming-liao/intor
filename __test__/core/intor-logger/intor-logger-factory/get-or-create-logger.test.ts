import { IntorLogger } from "../../../../src/intor/core/intor-logger/intor-logger";
import { getOrCreateLogger } from "../../../../src/intor/core/intor-logger/intor-logger-factory/get-or-create-logger";
import { intorLoggerCoreMap } from "../../../../src/intor/core/intor-logger/intor-logger-factory/intor-logger-core-map";

jest.mock(
  "../../../../src/intor/core/intor-logger/intor-logger-factory/intor-logger-core-map",
  () => ({
    intorLoggerCoreMap: new Map(),
  }),
);

describe("getOrCreateLogger", () => {
  it("should create a new logger instance", () => {
    const logger = getOrCreateLogger({ id: "test-logger" });

    expect(logger).toBeInstanceOf(IntorLogger);
  });

  it("should return the same logger core for the same ID", () => {
    const logger1 = getOrCreateLogger({ id: "shared-logger" });
    const logger2 = getOrCreateLogger({ id: "shared-logger" });

    expect(logger1["core"]).toBe(logger2["core"]);
  });

  it("should update log level if a new level is provided", () => {
    const logger = getOrCreateLogger({ id: "level-test", level: "error" });

    expect(logger["core"].level).toBe("error");

    const updatedLogger = getOrCreateLogger({
      id: "level-test",
      level: "warn",
    });

    expect(updatedLogger["core"].level).toBe("warn");
  });

  it("should create a new logger if the logger core cannot be found", () => {
    const logger = getOrCreateLogger({ id: "non-existing-logger" });
    expect(logger).toBeInstanceOf(IntorLogger);
  });

  it("should throw an error if the logger core cannot be found", () => {
    const loggerId = "non-existing-logger";

    // Mock `intorLoggerCoreMap.get` to return undefined, simulating the core not being found.
    intorLoggerCoreMap.get = jest.fn().mockReturnValue(undefined);

    // Now calling getOrCreateLogger should throw an error
    expect(() => {
      getOrCreateLogger({ id: loggerId });
    }).toThrow(`Logger core with ID '${loggerId}' could not be found.`);
  });
});
