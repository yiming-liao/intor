/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LocaleMessages } from "intor-translator";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as loggerModule from "@/core/logger/get-logger";
import { getGlobalMessagesPool } from "@/core/messages/global-messages-pool";
import { loadLocalMessages } from "@/server/messages/load-local-messages/load-local-messages";
import * as readModule from "@/server/messages/load-local-messages/read-locale-messages";

const loggerChildMock = { debug: vi.fn(), trace: vi.fn(), warn: vi.fn() };
const loggerMock = {
  child: vi.fn().mockReturnValue(loggerChildMock),
  core: { level: "debug" },
};

vi.spyOn(loggerModule, "getLogger").mockImplementation(() => loggerMock as any);
vi.mock(
  "@/server/messages/load-local-messages/read-locale-messages/read-locale-messages",
);
vi.mock("@/core/messages/global-messages-pool");

describe("loadLocalMessages", () => {
  const mockReadLocaleMessages = readModule.readLocaleMessages;
  const mockPool = {
    get: vi.fn(),
    set: vi.fn(),
  } as any;

  vi.mocked(getGlobalMessagesPool).mockReturnValue(mockPool);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return messages from readLocaleMessages", async () => {
    const enMessages: LocaleMessages = { "en-US": { hello: "Hello" } };
    vi.mocked(mockReadLocaleMessages).mockResolvedValueOnce(enMessages);
    const result = await loadLocalMessages({
      locale: "en-US",
      cacheOptions: { enabled: false, ttl: 0 },
      loggerOptions: { id: "test" },
    });
    expect(result).toEqual(enMessages);
    expect(mockReadLocaleMessages).toHaveBeenCalledTimes(1);
  });

  it("should break loop if a locale succeeds", async () => {
    const enMessages: LocaleMessages = { "en-US": { hello: "Hello" } };
    vi.mocked(mockReadLocaleMessages)
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce(enMessages);
    const result = await loadLocalMessages({
      locale: "fr-FR",
      fallbackLocales: ["en-US"],
      cacheOptions: { enabled: false, ttl: 0 },
      loggerOptions: { id: "test" },
    });
    expect(result).toEqual(enMessages);
    expect(mockReadLocaleMessages).toHaveBeenCalledTimes(2);
  });

  it("should return cached messages if available", async () => {
    const cached: LocaleMessages = { "en-US": { hello: "Cached" } };
    mockPool.get.mockImplementation(async () => cached);
    const result = await loadLocalMessages({
      locale: "en-US",
      cacheOptions: { enabled: true, ttl: 60 * 60 * 1000 },
      loggerOptions: { id: "test" },
    });
    expect(result).toEqual(cached);
    expect(mockPool.get).toHaveBeenCalled();
    expect(mockPool.set).not.toHaveBeenCalled();
  });

  it("should return undefined if all locales fail", async () => {
    vi.mocked(mockReadLocaleMessages)
      .mockRejectedValueOnce(new Error("fail1"))
      .mockRejectedValueOnce(new Error("fail2"));
    const result = await loadLocalMessages({
      locale: "fr-FR",
      fallbackLocales: ["en-US"],
      cacheOptions: { enabled: false, ttl: 0 },
      loggerOptions: { id: "test" },
    });
    expect(result).toBeUndefined();
    expect(mockReadLocaleMessages).toHaveBeenCalledTimes(2);
  });

  it("should ignore cache if cache is disabled", async () => {
    const enMessages: LocaleMessages = { "en-US": { hello: "Hello" } };
    vi.mocked(mockReadLocaleMessages).mockResolvedValueOnce(enMessages);
    const result = await loadLocalMessages({
      locale: "en-US",
      cacheOptions: { enabled: false, ttl: 60 * 60 * 1000 },
      loggerOptions: { id: "test" },
    });
    expect(result).toEqual(enMessages);
    expect(mockPool.get).not.toHaveBeenCalled();
    expect(mockPool.set).not.toHaveBeenCalled();
  });

  it("should continue to next locale if readLocaleMessages returns empty object", async () => {
    const enMessages: LocaleMessages = { "en-US": { hello: "Hello" } };
    vi.mocked(mockReadLocaleMessages)
      .mockResolvedValueOnce({ "fr-FR": {} })
      .mockResolvedValueOnce(enMessages);
    const result = await loadLocalMessages({
      locale: "fr-FR",
      fallbackLocales: ["en-US"],
      cacheOptions: { enabled: false, ttl: 0 },
      loggerOptions: { id: "test" },
    });
    expect(result).toEqual(enMessages);
    expect(mockReadLocaleMessages).toHaveBeenCalledTimes(2);
  });

  it("should write messages to cache when allowCacheWrite is true", async () => {
    const enMessages: LocaleMessages = { "en-US": { hello: "Hello" } };
    mockPool.get.mockResolvedValueOnce();
    vi.mocked(mockReadLocaleMessages).mockResolvedValueOnce(enMessages);
    const result = await loadLocalMessages({
      locale: "en-US",
      cacheOptions: { enabled: true, ttl: 60 * 60 * 1000 },
      loggerOptions: { id: "test" },
      allowCacheWrite: true,
    });
    expect(result).toEqual(enMessages);
    expect(mockPool.set).toHaveBeenCalledTimes(1);
    expect(mockPool.set).toHaveBeenCalledWith(
      expect.any(String), // cacheKey
      enMessages,
      60 * 60 * 1000,
    );
  });
});
