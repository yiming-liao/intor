/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LocaleMessages } from "intor-translator";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fetchModule from "@/server/messages/load-remote-messages/fetch-locale-messages";
import { loadRemoteMessages } from "@/server/messages/load-remote-messages/load-remote-messages";
import * as loggerModule from "@/server/shared/logger/get-logger";
import { getGlobalMessagesPool } from "@/server/shared/messages/global-messages-pool";
import * as cacheUtils from "@/shared/utils";

const loggerChildMock = {
  debug: vi.fn(),
  trace: vi.fn(),
  warn: vi.fn(),
};

const loggerMock = {
  child: vi.fn().mockReturnValue(loggerChildMock),
  core: { level: "debug" },
};

vi.spyOn(loggerModule, "getLogger").mockImplementation(() => loggerMock as any);
vi.mock("@/server/messages/load-remote-messages/fetch-locale-messages");
vi.mock("@/server/shared/messages/global-messages-pool");

describe("loadRemoteMessages", () => {
  const mockFetch = fetchModule.fetchLocaleMessages;
  const mockPool = {
    get: vi.fn(),
    set: vi.fn(),
  } as any;
  vi.mocked(getGlobalMessagesPool).mockReturnValue(mockPool);
  vi.spyOn(cacheUtils, "normalizeCacheKey").mockImplementation((parts) =>
    Array.isArray(parts) ? parts.join("|") : String(parts),
  );

  const baseParams = {
    rootDir: "/app",
    locale: "en-US",
    fallbackLocales: ["zh-TW"],
    namespaces: ["common"],
    remoteUrl: "https://api.example.com/messages",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns cached messages when cache hit", async () => {
    const cached: LocaleMessages = {
      "en-US": { hello: "world" },
    };
    mockPool.get.mockResolvedValue(cached);
    const result = await loadRemoteMessages({
      ...baseParams,
      allowCacheWrite: true,
      extraOptions: {
        cacheOptions: { enabled: true } as any,
      },
    });
    expect(mockPool.get).toHaveBeenCalledTimes(1);
    expect(result).toBe(cached);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("fetches remote messages when cache miss", async () => {
    mockPool.get.mockResolvedValue();
    const fetched: LocaleMessages = {
      "en-US": { hello: "remote" },
    };
    vi.mocked(mockFetch).mockResolvedValue(fetched);
    const result = await loadRemoteMessages({
      ...baseParams,
      allowCacheWrite: false,
    });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "en-US",
      }),
    );

    expect(result).toEqual(fetched);
  });

  it("falls back to fallback locale when primary locale has no messages", async () => {
    mockPool.get.mockResolvedValue();
    vi.mocked(mockFetch)
      .mockResolvedValueOnce({ "en-US": {} }) // empty
      .mockResolvedValueOnce({
        "zh-TW": { hello: "fallback" },
      });
    const result = await loadRemoteMessages({
      ...baseParams,
      allowCacheWrite: false,
    });
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      "zh-TW": { hello: "fallback" },
    });
  });

  it("returns undefined when all locales fail", async () => {
    mockPool.get.mockResolvedValue();
    vi.mocked(mockFetch).mockRejectedValue(new Error("network error"));
    const result = await loadRemoteMessages({
      ...baseParams,
      allowCacheWrite: false,
    });
    expect(result).toBeUndefined();
    expect(loggerChildMock.warn).toHaveBeenCalled();
    expect(loggerChildMock.trace).toHaveBeenCalled();
  });

  it("writes to cache when cache is enabled and allowCacheWrite is true", async () => {
    mockPool.get.mockResolvedValue();
    const fetched: LocaleMessages = {
      "en-US": { hello: "cache-me" },
    };
    vi.mocked(mockFetch).mockResolvedValue(fetched);
    const result = await loadRemoteMessages({
      ...baseParams,
      allowCacheWrite: true,
      extraOptions: {
        cacheOptions: { enabled: true, ttl: 60 },
      },
    });
    expect(mockPool.set).toHaveBeenCalledWith(expect.any(String), fetched, 60);
    expect(result).toEqual(fetched);
  });

  it("does not read or write cache when cache is disabled", async () => {
    mockPool.get.mockResolvedValue();
    const fetched: LocaleMessages = {
      "en-US": { hello: "no-cache" },
    };
    vi.mocked(mockFetch).mockResolvedValue(fetched);
    const result = await loadRemoteMessages({
      ...baseParams,
      allowCacheWrite: true,
      extraOptions: {
        cacheOptions: { enabled: false } as any,
      },
    });
    expect(mockPool.get).not.toHaveBeenCalled();
    expect(mockPool.set).not.toHaveBeenCalled();
    expect(result).toEqual(fetched);
  });

  it("continues fetching when cache enabled but cache miss", async () => {
    mockPool.get.mockResolvedValue();
    vi.mocked(mockFetch).mockResolvedValue({
      "en-US": { hello: "after-miss" },
    });
    const result = await loadRemoteMessages({
      ...baseParams,
      allowCacheWrite: false,
      extraOptions: {
        cacheOptions: { enabled: true } as any,
      },
    });
    expect(mockPool.get).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalled();
    expect(result).toEqual({
      "en-US": { hello: "after-miss" },
    });
  });
});
