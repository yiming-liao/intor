import type { LocaleNamespaceMessages } from "../../../../src/intor/types/message-structure-types";
import fetchMock from "jest-fetch-mock";
import { mockIntorLogger } from "../../../mock/mock-intor-logger";
import { fetcher } from "../../../../src/intor/core/intor-messages-loader/fetch-api-messages/fetcher";

fetchMock.enableMocks();
const { mockLogWarn } = mockIntorLogger();
jest.mock("../../../../src/intor/core/intor-logger", () => {
  return {
    ...jest.requireActual("../../../../src/intor/core/intor-logger"),
    getOrCreateLogger: jest.fn(() => ({
      warn: mockLogWarn,
    })),
  };
});

describe("fetcher", () => {
  const baseUrl = "https://example.com/messages";
  const locale = "en";
  const loggerId = "testLoggerId";
  const searchParams = new URLSearchParams({ key: "value" });

  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  it("should fetch and return messages for a valid response", async () => {
    const mockResponse: LocaleNamespaceMessages = {
      common: {
        greeting: "Hello",
      },
      home: {
        title: "Home Page",
      },
    };

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), { status: 200 }),
    );

    const urlWithLocale = new URL(baseUrl);
    urlWithLocale.searchParams.append("locale", locale);
    urlWithLocale.searchParams.append("key", "value");

    const messages = await fetcher<typeof mockResponse>({
      apiUrl: baseUrl,
      locale,
      searchParams,
      loggerId,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("locale=en"),
      expect.any(Object),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("key=value"),
      expect.any(Object),
    );
    expect(messages).toEqual(mockResponse);
  });

  it("should handle fetch failure with non-OK response", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 500 }));

    const messages = await fetcher({
      apiUrl: baseUrl,
      locale,
      searchParams,
      loggerId,
    });

    expect(messages).toBeUndefined();
    expect(fetchMock).toHaveBeenCalled();
  });

  it("should handle invalid JSON response", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response("Invalid JSON", { status: 200 }),
    );

    const messages = await fetcher({
      apiUrl: baseUrl,
      locale,
      searchParams,
      loggerId,
    });

    expect(messages).toBeUndefined();
    expect(fetchMock).toHaveBeenCalled();
  });

  it("should handle empty object response", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({}), { status: 200 }),
    );

    const messages = await fetcher({
      apiUrl: baseUrl,
      locale,
      searchParams,
      loggerId,
    });

    expect(messages).toBeUndefined();
    expect(fetchMock).toHaveBeenCalled();
  });

  it("should log an error when fetching fails", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 500 }));

    await fetcher({
      apiUrl: baseUrl,
      locale,
      searchParams,
      loggerId,
    });

    expect(mockLogWarn).toHaveBeenCalledWith(
      expect.stringContaining("Failed to fetch messages for locale"),
      expect.objectContaining({
        locale,
        apiUrl: baseUrl,
        searchParams: expect.any(String),
      }),
    );
  });

  it("should handle fetch timeout or network errors gracefully", async () => {
    fetchMock.mockRejectedValueOnce(new Error("Network error"));

    const messages = await fetcher({
      apiUrl: baseUrl,
      locale,
      searchParams,
      loggerId,
    });

    expect(messages).toBeUndefined();
    expect(fetchMock).toHaveBeenCalled();
  });
});
