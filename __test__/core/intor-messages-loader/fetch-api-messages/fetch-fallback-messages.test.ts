import type { LocaleNamespaceMessages } from "../../../../src/intor/types/message-structure-types";
import { fetchFallbackMessages } from "../../../../src/intor/core/intor-messages-loader/fetch-api-messages/fetch-fallback-messages";
import { fetcher } from "../../../../src/intor/core/intor-messages-loader/fetch-api-messages/fetcher";

jest.mock(
  "../../../../src/intor/core/intor-messages-loader/fetch-api-messages/fetcher.ts",
);

const mockedFetcher = fetcher as jest.Mock;

describe("fetchFallbackMessages", () => {
  const apiUrl = "https://example.com/api/messages";
  const searchParams = new URLSearchParams({ ns: "common" });
  const loggerId = "test-logger";

  const mockMessages = (locale: string) =>
    ({
      [locale]: { hello: `Hello from ${locale}` },
    }) as LocaleNamespaceMessages;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns messages from the first successful fallback locale", async () => {
    mockedFetcher.mockImplementationOnce(async () => mockMessages("zh-TW"));

    const result = await fetchFallbackMessages(
      apiUrl,
      searchParams,
      ["zh-TW", "en"],
      loggerId,
    );

    expect(result).toEqual({
      locale: "zh-TW",
      messages: mockMessages("zh-TW"),
    });
    expect(mockedFetcher).toHaveBeenCalledTimes(1);
    expect(mockedFetcher).toHaveBeenCalledWith({
      apiUrl,
      searchParams,
      locale: "zh-TW",
      loggerId,
    });
  });

  it("tries all fallbacks until it finds one that works", async () => {
    mockedFetcher
      .mockImplementationOnce(async () => undefined)
      .mockImplementationOnce(async () => mockMessages("en"));

    const result = await fetchFallbackMessages(
      apiUrl,
      searchParams,
      ["zh-TW", "en"],
      loggerId,
    );

    expect(result).toEqual({
      locale: "en",
      messages: mockMessages("en"),
    });
    expect(mockedFetcher).toHaveBeenCalledTimes(2);
  });

  it("returns undefined if all fallbacks fail", async () => {
    mockedFetcher.mockImplementation(async () => undefined);

    const result = await fetchFallbackMessages(
      apiUrl,
      searchParams,
      ["zh-TW", "en"],
      loggerId,
    );

    expect(result).toBeUndefined();
    expect(mockedFetcher).toHaveBeenCalledTimes(2);
  });

  it("returns undefined if no fallback locales are provided", async () => {
    const result = await fetchFallbackMessages(
      apiUrl,
      searchParams,
      [],
      loggerId,
    );

    expect(result).toBeUndefined();
    expect(mockedFetcher).not.toHaveBeenCalled();
  });
});
