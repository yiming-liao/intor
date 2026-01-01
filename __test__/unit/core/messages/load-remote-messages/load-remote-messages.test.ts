/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LocaleMessages } from "intor-translator";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as loggerModule from "@/core/logger";
import * as fetchModule from "@/core/messages/load-remote-messages/fetch-locale-messages";
import { loadRemoteMessages } from "@/core/messages/load-remote-messages/load-remote-messages";
import * as cacheUtils from "@/core/utils";

describe("loadRemoteMessages", () => {
  const loggerChild = {
    debug: vi.fn(),
    trace: vi.fn(),
    warn: vi.fn(),
  };

  const logger = {
    child: vi.fn(() => loggerChild),
  };

  const pool = {
    get: vi.fn(),
    set: vi.fn(),
  };

  const baseParams = {
    locale: "en-US",
    fallbackLocales: ["zh-TW"],
    namespaces: ["common"],
    rootDir: "messages",
    url: "https://api.example.com/messages",
    headers: { Authorization: "Bearer token" },
    loggerOptions: { id: "test" },
    pool,
    cacheOptions: { enabled: false, ttl: 0 },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(loggerModule, "getLogger").mockReturnValue(logger as any);

    vi.spyOn(cacheUtils, "normalizeCacheKey").mockImplementation(
      (parts: unknown) =>
        Array.isArray(parts) ? parts.join("|") : String(parts),
    );
  });

  it("returns early if signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    const fetchSpy = vi.spyOn(fetchModule, "fetchLocaleMessages");

    const result = await loadRemoteMessages({
      ...baseParams,
      signal: controller.signal,
    } as any);

    expect(result).toBeUndefined();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns cached messages when cache hit", async () => {
    const cached: LocaleMessages = {
      "en-US": { hello: "cached" },
    };

    pool.get.mockResolvedValue(cached);

    const fetchSpy = vi.spyOn(fetchModule, "fetchLocaleMessages");

    const result = await loadRemoteMessages({
      ...baseParams,
      cacheOptions: { enabled: true, ttl: 60 },
    } as any);

    expect(pool.get).toHaveBeenCalledOnce();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result).toBe(cached);
  });

  it("tries fallback locale when primary locale has no messages", async () => {
    pool.get.mockResolvedValue(undefined);

    const fetchSpy = vi
      .spyOn(fetchModule, "fetchLocaleMessages")
      .mockResolvedValueOnce({ "en-US": {} })
      .mockResolvedValueOnce({
        "zh-TW": { hello: "fallback" },
      });

    const result = await loadRemoteMessages(baseParams as any);

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy.mock.calls[0][0].locale).toBe("en-US");
    expect(fetchSpy.mock.calls[1][0].locale).toBe("zh-TW");

    expect(result).toEqual({
      "zh-TW": { hello: "fallback" },
    });
  });

  it("writes to cache only when allowCacheWrite is true", async () => {
    pool.get.mockResolvedValue(undefined);

    const fetched: LocaleMessages = {
      "en-US": { hello: "write-me" },
    };

    vi.spyOn(fetchModule, "fetchLocaleMessages").mockResolvedValue(fetched);

    const result = await loadRemoteMessages({
      ...baseParams,
      allowCacheWrite: true,
      cacheOptions: { enabled: true, ttl: 120 },
    } as any);

    expect(pool.set).toHaveBeenCalledOnce();
    expect(pool.set).toHaveBeenCalledWith(expect.any(String), fetched, 120);
    expect(result).toEqual(fetched);
  });

  it("returns early when fetch is aborted during execution", async () => {
    const controller = new AbortController();

    vi.spyOn(fetchModule, "fetchLocaleMessages").mockImplementation(
      async () => {
        controller.abort();
        throw new DOMException("aborted", "AbortError");
      },
    );

    const result = await loadRemoteMessages({
      ...baseParams,
      signal: controller.signal,
    } as any);

    expect(result).toBeUndefined();
    expect(loggerChild.debug).toHaveBeenCalled();
  });

  it("returns undefined when all locales fail", async () => {
    pool.get.mockResolvedValue(undefined);

    vi.spyOn(fetchModule, "fetchLocaleMessages").mockRejectedValue(
      new Error("network error"),
    );

    const result = await loadRemoteMessages(baseParams as any);

    expect(result).toBeUndefined();
    expect(loggerChild.warn).toHaveBeenCalled();
  });
});
