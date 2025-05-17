import { printMeta } from "../../../../../src/intor/core/intor-logger/write-log/utils/print-meta";

describe("printMeta", () => {
  const metaDepth = 2;
  const isUseColor = false;

  let consoleDirSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleDirSpy = jest.spyOn(console, "dir").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleDirSpy.mockRestore();
  });

  it("should print Error instance as formatted error object", () => {
    const error = new Error("Test error");

    printMeta(error, metaDepth, isUseColor);

    expect(consoleDirSpy).toHaveBeenCalledWith(
      {
        error: {
          message: error.message,
          stack: error.stack?.split("\n").slice(0, 3).join("\n"),
        },
      },
      { depth: metaDepth, colors: isUseColor },
    );
  });

  it("should print object containing an Error under 'error' key", () => {
    const error = new Error("Nested error");
    const meta = { user: "john", error };

    printMeta(meta, metaDepth, isUseColor);

    expect(consoleDirSpy).toHaveBeenCalledWith(
      {
        user: "john",
        error: {
          message: error.message,
          stack: error.stack?.split("\n").slice(0, 3).join("\n"),
        },
      },
      { depth: metaDepth, colors: isUseColor },
    );
  });

  it("should print plain object as-is", () => {
    const meta = { event: "login", user: "alice" };

    printMeta(meta, metaDepth, isUseColor);

    expect(consoleDirSpy).toHaveBeenCalledWith(meta, {
      depth: metaDepth,
      colors: isUseColor,
    });
  });

  it("should print primitive value as-is", () => {
    const meta = "plain message";

    printMeta(meta, metaDepth, isUseColor);

    expect(consoleDirSpy).toHaveBeenCalledWith(meta, {
      depth: metaDepth,
      colors: isUseColor,
    });
  });

  it("should print undefined as-is", () => {
    printMeta(undefined, metaDepth, isUseColor);

    expect(consoleDirSpy).toHaveBeenCalledWith(undefined, {
      depth: metaDepth,
      colors: isUseColor,
    });
  });

  it("should truncate stack to the specified number of lines", () => {
    const fakeStack = [
      "Error: Custom error",
      "    at doSomething (/app/index.js:10:5)",
      "    at run (/app/index.js:20:3)",
      "    at main (/app/index.js:30:1)",
    ].join("\n");

    const error = new Error("Custom error");
    error.stack = fakeStack;

    printMeta(error, metaDepth, isUseColor);

    expect(consoleDirSpy).toHaveBeenCalledWith(
      {
        error: {
          message: "Custom error",
          stack: fakeStack.split("\n").slice(0, 3).join("\n"),
        },
      },
      { depth: metaDepth, colors: isUseColor },
    );
  });

  it("should handle Error instance with undefined stack", () => {
    const error = new Error("No stack");
    error.stack = undefined; // 強制模擬無 stack 情況

    printMeta(error, metaDepth, isUseColor);

    expect(consoleDirSpy).toHaveBeenCalledWith(
      {
        error: {
          message: "No stack",
          stack: undefined,
        },
      },
      { depth: metaDepth, colors: isUseColor },
    );
  });
});
