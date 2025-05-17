import { getOrCreateLogger } from "../../../../src/intor/core/intor-logger";
import { fetchApiMessages } from "../../../../src/intor/core/intor-messages-loader/fetch-api-messages/fetch-api-messages";
import { fetchFallbackMessages } from "../../../../src/intor/core/intor-messages-loader/fetch-api-messages/fetch-fallback-messages";
import { fetcher } from "../../../../src/intor/core/intor-messages-loader/fetch-api-messages/fetcher";

jest.mock(
  "../../../../src/intor/core/intor-messages-loader/fetch-api-messages/fetcher",
);
jest.mock(
  "../../../../src/intor/core/intor-messages-loader/fetch-api-messages/fetch-fallback-messages",
);
jest.mock("../../../../src/intor/core/intor-logger");

const mockFetcher = fetcher as jest.Mock;
const mockFetchFallbackMessages = fetchFallbackMessages as jest.Mock;
const mockLogger = {
  warn: jest.fn(),
  info: jest.fn(),
};
(getOrCreateLogger as jest.Mock).mockReturnValue(mockLogger);

const baseOptions = {
  apiUrl: "https://example.com/i18n",
  basePath: "public",
  locale: "zh-TW",
  fallbackLocales: ["en", "ja"],
  namespaces: ["common", "home"],
  loggerId: "test-logger",
};

describe("fetchApiMessages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return undefined and warn if apiUrl is missing", async () => {
    const result = await fetchApiMessages({
      ...baseOptions,
      apiUrl: "",
    });

    expect(result).toBeUndefined();
    expect(mockLogger.warn).toHaveBeenCalledWith(
      "No apiUrl provided for fetchApiMessages. Skipping fetch.",
    );
  });

  it("should return messages if fetcher returns messages for target locale", async () => {
    mockFetcher.mockResolvedValueOnce({ greeting: "你好" });

    const result = await fetchApiMessages(baseOptions);

    expect(result).toEqual({ greeting: "你好" });
    expect(mockFetcher).toHaveBeenCalledWith(
      expect.objectContaining({ locale: "zh-TW" }),
    );
    expect(mockFetchFallbackMessages).not.toHaveBeenCalled();
  });

  it("should try fallback locales if target locale fails", async () => {
    mockFetcher.mockResolvedValueOnce(undefined); // zh-TW fail
    mockFetchFallbackMessages.mockResolvedValueOnce({
      locale: "en",
      messages: { greeting: "Hello" },
    });

    const result = await fetchApiMessages(baseOptions);

    expect(mockFetcher).toHaveBeenCalled();
    expect(mockFetchFallbackMessages).toHaveBeenCalledWith(
      baseOptions.apiUrl,
      expect.any(URLSearchParams),
      baseOptions.fallbackLocales,
      baseOptions.loggerId,
    );
    expect(mockLogger.info).toHaveBeenCalledWith(
      "Fallback locale succeeded.",
      expect.objectContaining({
        usedLocale: "en",
      }),
    );
    expect(result).toEqual({ greeting: "Hello" });
  });

  it("should return undefined and log error if all fetches fail", async () => {
    mockFetcher.mockResolvedValueOnce(undefined);
    mockFetchFallbackMessages.mockResolvedValueOnce(undefined);

    const result = await fetchApiMessages(baseOptions);

    expect(result).toBeUndefined();
    expect(mockLogger.warn).toHaveBeenCalledWith(
      "Failed to fetch messages for all locales.",
      expect.objectContaining({
        fallbackLocales: ["en", "ja"],
      }),
    );
  });

  it("should still fetch when namespaces is empty", async () => {
    mockFetcher.mockResolvedValueOnce({ foo: "bar" });

    const result = await fetchApiMessages({
      apiUrl: "https://example.com/api/messages",
      basePath: "common",
      locale: "en",
      fallbackLocales: ["zh"],
      namespaces: [],
      loggerId: "test",
    });

    expect(result).toEqual({ foo: "bar" });
    expect(mockFetcher).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "en",
      }),
    );
  });

  it("should skip fallback if fallbackLocales is empty", async () => {
    mockFetcher.mockResolvedValueOnce(undefined); // primary fail

    const result = await fetchApiMessages({
      apiUrl: "https://example.com/api/messages",
      basePath: "common",
      locale: "en",
      fallbackLocales: [],
      namespaces: ["common"],
      loggerId: "test",
    });

    expect(result).toBeUndefined();
    expect(mockFetcher).toHaveBeenCalledTimes(1); // only once for 'en'
  });

  it("should log error if all fallbacks fail", async () => {
    mockFetcher
      .mockImplementationOnce(() => Promise.resolve(undefined)) // en
      .mockImplementationOnce(() => Promise.resolve(undefined)) // zh
      .mockImplementationOnce(() => Promise.resolve(undefined)); // fr

    const result = await fetchApiMessages({
      apiUrl: "https://example.com/api/messages",
      basePath: "common",
      locale: "en",
      fallbackLocales: ["zh", "fr"],
      namespaces: ["common"],
      loggerId: "test",
    });

    expect(mockFetchFallbackMessages).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
