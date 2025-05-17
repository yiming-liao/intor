import {
  clearMessageKeyCache,
  getMessageKeyCache,
  IntorCache,
} from "../../../src//intor/core/intor-cache";

describe("MessageKeyCache", () => {
  const originalWindow = global.window;

  afterEach(() => {
    clearMessageKeyCache();

    Object.defineProperty(global, "window", {
      configurable: true,
      value: originalWindow,
      writable: true,
    });
  });

  it("should create cache instance only in browser environment", () => {
    Object.defineProperty(global, "window", {
      configurable: true,
      value: undefined,
      writable: true,
    });

    expect(getMessageKeyCache()).toBeUndefined();

    Object.defineProperty(global, "window", {
      configurable: true,
      value: {},
      writable: true,
    });

    const cache1 = getMessageKeyCache();
    expect(cache1).toBeInstanceOf(IntorCache);

    const cache2 = getMessageKeyCache();
    expect(cache2).toBe(cache1);
  });

  it("should clear cache and reset instance", () => {
    Object.defineProperty(global, "window", {
      configurable: true,
      value: {},
      writable: true,
    });

    const cache = getMessageKeyCache();
    expect(cache).toBeDefined();

    const spyClear = jest.spyOn(cache!, "clear");
    clearMessageKeyCache();

    expect(spyClear).toHaveBeenCalled();
    expect(getMessageKeyCache()).not.toBe(cache);
  });
});
