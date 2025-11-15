/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LocaleMessages } from "intor-translator";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchFallbackMessages } from "@/modules/messages/load-api-messages/fetch-fallback-messages";
import { fetchMessages } from "@/modules/messages/load-api-messages/fetch-messages";
import { loadApiMessages } from "@/modules/messages/load-api-messages/load-api-messages";
import { buildSearchParams } from "@/modules/messages/load-api-messages/utils/build-search-params";
import { getLogger } from "@/shared/logger/get-logger";
import { getGlobalMessagesPool } from "@/shared/messages/global-messages-pool";

vi.mock("@/modules/messages/load-api-messages/fetch-messages");
vi.mock("@/modules/messages/load-api-messages/fetch-fallback-messages");
vi.mock("@/shared/messages/global-messages-pool");
vi.mock("@/shared/logger/get-logger");
vi.mock("@/modules/messages/load-api-messages/utils/build-search-params");

describe("loadApiMessages", () => {
  let mockLogger: any;
  let mockPool: any;

  beforeEach(() => {
    mockLogger = {
      warn: vi.fn(),
      info: vi.fn(),
      debug: vi.fn(),
      child: vi.fn().mockReturnThis(),
    };
    vi.mocked(getLogger).mockReturnValue(mockLogger);

    mockPool = {
      get: vi.fn(),
      set: vi.fn(),
    };
    vi.mocked(getGlobalMessagesPool).mockReturnValue(mockPool);

    vi.mocked(buildSearchParams).mockImplementation(
      (params: any) => new URLSearchParams(params),
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should warn and return undefined if apiUrl is missing", async () => {
    const result = await loadApiMessages<LocaleMessages>({
      apiUrl: "",
      locale: "en",
    } as any);
    expect(result).toBeUndefined();
    expect(mockLogger.warn).toHaveBeenCalledWith(
      "No apiUrl provided. Skipping fetch.",
    );
  });

  it("should return cached messages if cache hit", async () => {
    const cachedMessages = { hello: "world" };
    mockPool.get.mockResolvedValue(cachedMessages);

    const result = await loadApiMessages<LocaleMessages>({
      apiUrl: "https://api.test",
      locale: "en",
      cache: { enabled: true, ttl: 1000 },
    } as any);

    expect(result).toBe(cachedMessages);
    expect(mockLogger.debug).toHaveBeenCalledWith("Messages cache hit.", {
      key: expect.any(String),
    });
  });

  it("should fetch messages and cache them if not cached", async () => {
    const fetchedMessages = { hi: "there" };
    mockPool.get.mockResolvedValue();
    vi.mocked(fetchMessages).mockResolvedValue(fetchedMessages as any);

    const result = await loadApiMessages<LocaleMessages>({
      apiUrl: "https://api.test",
      locale: "en",
      cache: { enabled: true, ttl: 1000 },
    } as any);

    expect(result).toBe(fetchedMessages);
    expect(mockPool.set).toHaveBeenCalledWith(
      expect.any(String),
      fetchedMessages,
      1000,
    );
  });

  it("should use fallback messages if fetchMessages returns undefined", async () => {
    const fallbackResult = { locale: "fr", messages: { bonjour: "monde" } };
    mockPool.get.mockResolvedValue();
    vi.mocked(fetchMessages).mockResolvedValue(undefined);
    vi.mocked(fetchFallbackMessages).mockResolvedValue(fallbackResult as any);

    const result = await loadApiMessages<LocaleMessages>({
      apiUrl: "https://api.test",
      locale: "en",
      fallbackLocales: ["fr"],
      cache: { enabled: true, ttl: 1000 },
    });

    expect(result).toBe(fallbackResult.messages);
    expect(mockLogger.info).toHaveBeenCalledWith("Fallback locale succeeded.", {
      usedLocale: "fr",
      apiUrl: "https://api.test",
      searchParams: expect.any(String),
    });
    expect(mockPool.set).toHaveBeenCalledWith(
      expect.any(String),
      fallbackResult.messages,
      1000,
    );
  });

  it("should warn and return undefined if all fetch attempts fail", async () => {
    mockPool.get.mockResolvedValue();
    vi.mocked(fetchMessages).mockResolvedValue(undefined);
    vi.mocked(fetchFallbackMessages).mockResolvedValue(undefined);

    const result = await loadApiMessages<LocaleMessages>({
      apiUrl: "https://api.test",
      locale: "en",
      fallbackLocales: ["fr"],
      cache: { enabled: true, ttl: 1000 },
    });

    expect(result).toBeUndefined();
    expect(mockLogger.warn).toHaveBeenCalledWith(
      "Failed to fetch messages for all locales.",
      { locale: "en", fallbackLocales: ["fr"] },
    );
  });
});
