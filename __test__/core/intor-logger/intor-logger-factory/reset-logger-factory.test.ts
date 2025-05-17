import { getOrCreateLogger } from "../../../../src/intor/core/intor-logger/intor-logger-factory/get-or-create-logger";
import { resetLoggerFactory } from "../../../../src/intor/core/intor-logger/intor-logger-factory/reset-logger-factory";

describe("resetLoggerFactory", () => {
  it("should reset the logger factory and remove all logger cores", () => {
    const logger1 = getOrCreateLogger({ id: "reset-test" });

    resetLoggerFactory();

    const logger2 = getOrCreateLogger({ id: "reset-test" });

    expect(logger1["core"]).not.toBe(logger2["core"]);
  });
});
