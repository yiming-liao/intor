import { getMessageKeyCache } from "../../../../src/intor/core/intor-cache";
import { getValueByKey } from "../../../../src/intor/core/intor-translator/utils/get-value-by-key";

jest.mock("../../../../src/intor/core/intor-cache", () => ({
  getMessageKeyCache: jest.fn().mockReturnValue({
    get: jest.fn(),
    set: jest.fn(),
    has: jest.fn(),
    clear: jest.fn(),
  }),
}));

describe("getValueByKey", () => {
  const messages = {
    home: {
      title: "Welcome Home",
    },
  };

  afterEach(() => {
    const mockCache = getMessageKeyCache();
    jest.clearAllMocks();
    if (mockCache) {
      (mockCache.clear as jest.Mock).mockClear();
    }
  });

  it("should return the correct value from messages when cache is not used", () => {
    const result = getValueByKey("en", messages, "home.title", false);
    expect(result).toBe("Welcome Home");
  });

  it("should return undefined if the key does not exist in messages", () => {
    const result = getValueByKey("en", messages, "home.nonExistentKey", false);
    expect(result).toBeUndefined();
  });

  it("should return the value from cache if cache is used and the key exists in cache", () => {
    const mockCache = getMessageKeyCache();
    const cacheKey = "home.title";

    (mockCache?.has as jest.Mock).mockReturnValue(true);
    (mockCache?.get as jest.Mock).mockReturnValue("Cached Home");

    const result = getValueByKey("en", messages, cacheKey, true);

    expect(result).toBe("Cached Home");

    expect(mockCache?.has).toHaveBeenCalledWith(cacheKey);

    expect(mockCache?.get).toHaveBeenCalledWith(cacheKey);
  });

  it("should return the value from messages and update the cache if cache is used but the key is not found", () => {
    const mockCache = getMessageKeyCache();
    const cacheKey = "home.title";

    (mockCache?.has as jest.Mock).mockReturnValue(false);
    (mockCache?.get as jest.Mock).mockReturnValue(undefined);

    const result = getValueByKey("en", messages, cacheKey, true);

    expect(result).toBe("Welcome Home");

    expect(mockCache?.set).toHaveBeenCalledWith(cacheKey, "Welcome Home");
  });

  it("should clear the cache only once when locale changes", () => {
    const mockCache = getMessageKeyCache();
    const cacheKey = "home.title";

    (mockCache?.has as jest.Mock).mockReturnValue(true);
    (mockCache?.get as jest.Mock).mockReturnValue("Cached Home");

    getValueByKey("en", messages, cacheKey, true);

    expect(mockCache?.clear).toHaveBeenCalledTimes(1);
    expect(mockCache?.set).toHaveBeenCalledTimes(1);
  });
});
