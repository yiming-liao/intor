/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as coreModule from "../../../../../src/core";
import * as loggerModule from "../../../../../src/core/logger/get-logger";
import * as poolModule from "../../../../../src/server/messages/load-local-messages/cache/messages-pool";
import { loadLocalMessages } from "../../../../../src/server/messages/load-local-messages/load-local-messages";
import * as readModule from "../../../../../src/server/messages/load-local-messages/read-locale-messages";

describe("loadLocalMessages()", () => {
  const debug = vi.fn();
  const trace = vi.fn();
  const warn = vi.fn();

  const pool = {
    get: vi.fn(),
    set: vi.fn(),
  };

  const ORIGINAL_ENV = process.env["NODE_ENV"];

  beforeEach(() => {
    vi.clearAllMocks();
    process.env["NODE_ENV"] = "test";
    vi.spyOn(loggerModule, "getLogger").mockReturnValue({
      child: () => ({ debug, trace, warn }),
    } as any);
    vi.spyOn(poolModule, "getMessagesPool").mockReturnValue(pool as any);
    vi.spyOn(coreModule, "normalizeCacheKey").mockReturnValue("key");
    vi.spyOn(readModule, "readLocaleMessages");
  });

  afterEach(() => {
    process.env["NODE_ENV"] = ORIGINAL_ENV;
  });

  it("returns cached messages when cache hit", async () => {
    pool.get.mockReturnValue({ en: { hello: "cached" } });
    const result = await loadLocalMessages({
      id: "test",
      locale: "en",
      fallbackLocales: [],
      readers: {},
    } as any);
    expect(result).toEqual({ en: { hello: "cached" } });
    expect(readModule.readLocaleMessages).not.toHaveBeenCalled();
  });

  it("loads messages for primary locale", async () => {
    pool.get.mockReturnValue(undefined);
    (readModule.readLocaleMessages as any).mockResolvedValue({
      en: { hello: "world" },
    });
    const result = await loadLocalMessages({
      id: "test",
      locale: "en",
      fallbackLocales: [],
      readers: {},
    } as any);
    expect(result).toEqual({ en: { hello: "world" } });
    expect(trace).toHaveBeenCalled();
  });

  it("falls back when primary locale has no messages", async () => {
    (readModule.readLocaleMessages as any)
      .mockResolvedValueOnce({ en: {} })
      .mockResolvedValueOnce({ zh: { hello: "zh" } });
    const result = await loadLocalMessages({
      id: "test",
      locale: "en",
      fallbackLocales: ["zh"],
      readers: {},
    } as any);
    expect(result).toEqual({ zh: { hello: "zh" } });
  });

  it("returns undefined when all locales are empty", async () => {
    (readModule.readLocaleMessages as any).mockResolvedValue({ en: {} });
    const result = await loadLocalMessages({
      id: "test",
      locale: "en",
      fallbackLocales: [],
      readers: {},
    } as any);
    expect(result).toBeUndefined();
  });

  it("warns and tries fallback when primary throws", async () => {
    (readModule.readLocaleMessages as any)
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce({ zh: { ok: true } });
    const result = await loadLocalMessages({
      id: "test",
      locale: "en",
      fallbackLocales: ["zh"],
      readers: {},
    } as any);
    expect(warn).toHaveBeenCalled();
    expect(result).toEqual({ zh: { ok: true } });
  });

  it("warns when all candidate locales fail", async () => {
    (readModule.readLocaleMessages as any).mockRejectedValue(new Error("fail"));
    const result = await loadLocalMessages({
      id: "test",
      locale: "en",
      fallbackLocales: ["zh"],
      readers: {},
    } as any);
    expect(result).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      "Failed to load messages for all candidate locales.",
      expect.any(Object),
    );
  });

  it("writes cache only in production with allowCacheWrite", async () => {
    process.env["NODE_ENV"] = "production";
    (readModule.readLocaleMessages as any).mockResolvedValue({
      en: { ok: true },
    });
    await loadLocalMessages({
      id: "test",
      locale: "en",
      fallbackLocales: [],
      readers: {},
      allowCacheWrite: true,
    } as any);
    expect(pool.set).toHaveBeenCalledWith("key", {
      en: { ok: true },
    });
  });

  it("does not write cache outside production", async () => {
    (readModule.readLocaleMessages as any).mockResolvedValue({
      en: { ok: true },
    });
    await loadLocalMessages({
      id: "test",
      locale: "en",
      fallbackLocales: [],
      readers: {},
      allowCacheWrite: true,
    } as any);
    expect(pool.set).not.toHaveBeenCalled();
  });

  it("does not write cache when allowCacheWrite is false", async () => {
    process.env["NODE_ENV"] = "production";
    (readModule.readLocaleMessages as any).mockResolvedValue({
      en: { ok: true },
    });
    await loadLocalMessages({
      id: "test",
      locale: "en",
      fallbackLocales: [],
      readers: {},
      allowCacheWrite: false,
    } as any);
    expect(pool.set).not.toHaveBeenCalled();
  });

  it("passes namespaces only when defined", async () => {
    (readModule.readLocaleMessages as any).mockResolvedValue({
      en: { ok: true },
    });
    await loadLocalMessages({
      id: "test",
      locale: "en",
      fallbackLocales: [],
      namespaces: ["common"],
      readers: {},
    } as any);
    const call = (readModule.readLocaleMessages as any).mock.calls[0][0];
    expect(call.namespaces).toEqual(["common"]);
  });

  it("defaults readers to empty object", async () => {
    (readModule.readLocaleMessages as any).mockResolvedValue({
      en: { ok: true },
    });
    await loadLocalMessages({
      id: "test",
      locale: "en",
      fallbackLocales: [],
    } as any);
    const call = (readModule.readLocaleMessages as any).mock.calls[0][0];
    expect(call.readers).toEqual({});
  });

  it("skips cache when cacheKey is falsy", async () => {
    vi.spyOn(coreModule, "normalizeCacheKey").mockReturnValue(undefined as any);
    (readModule.readLocaleMessages as any).mockResolvedValue({
      en: { ok: true },
    });
    const result = await loadLocalMessages({
      id: "test",
      locale: "en",
      fallbackLocales: [],
      readers: {},
    } as any);
    expect(pool.get).not.toHaveBeenCalled();
    expect(result).toEqual({ en: { ok: true } });
  });

  it("handles undefined fallbackLocales", async () => {
    (readModule.readLocaleMessages as any).mockResolvedValue({
      en: { ok: true },
    });
    const result = await loadLocalMessages({
      id: "test",
      locale: "en",

      readers: {},
    } as any);
    expect(result).toEqual({ en: { ok: true } });
  });

  it("handles undefined locale result safely", async () => {
    (readModule.readLocaleMessages as any).mockResolvedValue({});
    const result = await loadLocalMessages({
      id: "test",
      locale: "en",
      fallbackLocales: [],
      readers: {},
    } as any);
    expect(result).toBeUndefined();
  });
});
