/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LocaleMessages } from "intor-translator";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fetchModule from "@/server/messages/load-remote-messages/fetch-locale-messages";
import { loadRemoteMessages } from "@/server/messages/load-remote-messages/load-remote-messages";
import { getGlobalMessagesPool } from "@/server/messages/shared/global-messages-pool";
import * as loggerModule from "@/server/shared/logger/get-logger";
import * as cacheUtils from "@/shared/utils";

const loggerChildMock = { debug: vi.fn(), trace: vi.fn(), warn: vi.fn() };
const loggerMock = {
  child: vi.fn().mockReturnValue(loggerChildMock),
  core: { level: "debug" },
};

vi.spyOn(loggerModule, "getLogger").mockImplementation(() => loggerMock as any);
vi.mock("@/server/messages/load-remote-messages/fetch-locale-messages");
vi.mock("@/server/messages/shared/global-messages-pool");

describe("loadRemoteMessages", () => {
  const mockFetch = fetchModule.fetchLocaleMessages;
  const mockPool = { get: vi.fn(), set: vi.fn() } as any;

  vi.mocked(getGlobalMessagesPool).mockReturnValue(mockPool);
  vi.spyOn(cacheUtils, "normalizeCacheKey").mockImplementation((parts) =>
    Array.isArray(parts) ? parts.join("|") : String(parts),
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return cached messages if available", async () => {
    const cached: LocaleMessages = { en: { ui: { hi: "cached" } } };
    mockPool.get.mockResolvedValueOnce(cached);

    const result = await loadRemoteMessages({
      locale: "en",
      remoteUrl: "https://api.example.com",
      namespaces: ["ui"],
      pool: mockPool,
      extraOptions: { cacheOptions: { enabled: true, ttl: 1000 } },
      fallbackLocales: [],
    });

    expect(result).toEqual(cached);
    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockPool.get).toHaveBeenCalled();
  });

  it("should fetch remote messages when cache miss", async () => {
    const remote: LocaleMessages = { en: { ui: { hi: "en-remote" } } };
    mockPool.get.mockResolvedValueOnce();
    vi.mocked(mockFetch).mockResolvedValueOnce(remote);

    const result = await loadRemoteMessages({
      locale: "en",
      remoteUrl: "https://api.example.com",
      namespaces: ["ui"],
      pool: mockPool,
      extraOptions: { cacheOptions: { enabled: true, ttl: 1000 } },
      fallbackLocales: [],
      allowCacheWrite: true,
    });

    expect(result).toEqual(remote);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockPool.set).toHaveBeenCalledWith(expect.any(String), remote, 1000);
  });

  it("should fallback to next locale if primary locale empty", async () => {
    const fallback: LocaleMessages = { zh: { ui: { hi: "fallback" } } };
    mockPool.get.mockResolvedValueOnce();

    vi.mocked(mockFetch)
      .mockResolvedValueOnce({ en: {} }) // primary empty
      .mockResolvedValueOnce(fallback); // fallback

    const result = await loadRemoteMessages({
      locale: "en",
      fallbackLocales: ["zh"],
      remoteUrl: "https://api.example.com",
      namespaces: ["ui"],
      pool: mockPool,
      extraOptions: { cacheOptions: { enabled: true, ttl: 1000 } },
    });

    expect(result).toEqual(fallback);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("should return undefined if all locales fail or empty", async () => {
    mockPool.get.mockResolvedValueOnce();
    vi.mocked(mockFetch)
      .mockResolvedValueOnce({ en: {} })
      .mockResolvedValueOnce({ zh: {} });

    const result = await loadRemoteMessages({
      locale: "en",
      fallbackLocales: ["zh"],
      remoteUrl: "https://api.example.com",
      namespaces: ["ui"],
      pool: mockPool,
      extraOptions: { cacheOptions: { enabled: true, ttl: 1000 } },
    });

    expect(result).toBeUndefined();
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("should normalize cache key correctly", async () => {
    mockPool.get.mockResolvedValueOnce();
    vi.mocked(mockFetch).mockResolvedValueOnce({ en: { ui: { hi: "msg" } } });

    await loadRemoteMessages({
      locale: "en",
      fallbackLocales: ["zh"],
      remoteUrl: "https://api.example.com",
      namespaces: ["ui"],
      pool: mockPool,
      extraOptions: { cacheOptions: { enabled: true, ttl: 1000 } },
    });

    expect(cacheUtils.normalizeCacheKey).toHaveBeenCalled();
    const keyParts = vi.mocked(cacheUtils.normalizeCacheKey).mock.calls[0][0];
    expect(keyParts).toContain("en");
    expect(keyParts).toContain("loaderType:remote");
    expect(keyParts).toContain("ui");
  });
});
