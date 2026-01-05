/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LocaleMessages } from "intor-translator";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as loggerModule from "@/core/logger/get-logger";
import { getGlobalMessagesPool } from "@/core/messages/global-messages-pool";
import { loadLocalMessages } from "@/server/messages/load-local-messages/load-local-messages";
import * as readModule from "@/server/messages/load-local-messages/read-locale-messages";

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

  it("returns messages from readLocaleMessages when cache is empty", async () => {
    const enMessages: LocaleMessages = {
      "en-US": { hello: "Hello" },
    };
    mockPool.get.mockResolvedValueOnce(undefined);
    vi.mocked(mockReadLocaleMessages).mockResolvedValueOnce(enMessages);
    const result = await loadLocalMessages({
      id: "test",
      locale: "en-US",
      loggerOptions: { id: "test" },
    });
    expect(result).toEqual(enMessages);
    expect(mockPool.get).toHaveBeenCalledTimes(1);
    expect(mockReadLocaleMessages).toHaveBeenCalledTimes(1);
  });

  it("returns cached messages if present in process-level cache", async () => {
    const cached: LocaleMessages = {
      "en-US": { hello: "Cached" },
    };
    mockPool.get.mockResolvedValueOnce(cached);
    const result = await loadLocalMessages({
      id: "test",
      locale: "en-US",
      loggerOptions: { id: "test" },
    });
    expect(result).toEqual(cached);
    expect(mockPool.get).toHaveBeenCalledTimes(1);
    expect(mockReadLocaleMessages).not.toHaveBeenCalled();
    expect(mockPool.set).not.toHaveBeenCalled();
  });

  it("tries fallback locales in order and stops at first successful result", async () => {
    const enMessages: LocaleMessages = {
      "en-US": { hello: "Hello" },
    };
    mockPool.get.mockResolvedValueOnce(undefined);
    vi.mocked(mockReadLocaleMessages)
      .mockRejectedValueOnce(new Error("fail fr-FR"))
      .mockResolvedValueOnce(enMessages);
    const result = await loadLocalMessages({
      id: "test",
      locale: "fr-FR",
      fallbackLocales: ["en-US"],
      loggerOptions: { id: "test" },
    });
    expect(result).toEqual(enMessages);
    expect(mockReadLocaleMessages).toHaveBeenCalledTimes(2);
  });

  it("continues to next locale if readLocaleMessages returns empty messages", async () => {
    const enMessages: LocaleMessages = {
      "en-US": { hello: "Hello" },
    };
    mockPool.get.mockResolvedValueOnce(undefined);
    vi.mocked(mockReadLocaleMessages)
      .mockResolvedValueOnce({ "fr-FR": {} })
      .mockResolvedValueOnce(enMessages);
    const result = await loadLocalMessages({
      id: "test",
      locale: "fr-FR",
      fallbackLocales: ["en-US"],
      loggerOptions: { id: "test" },
    });
    expect(result).toEqual(enMessages);
    expect(mockReadLocaleMessages).toHaveBeenCalledTimes(2);
  });

  it("returns undefined if all locales fail", async () => {
    mockPool.get.mockResolvedValueOnce(undefined);
    vi.mocked(mockReadLocaleMessages)
      .mockRejectedValueOnce(new Error("fail fr-FR"))
      .mockRejectedValueOnce(new Error("fail en-US"));
    const result = await loadLocalMessages({
      id: "test",
      locale: "fr-FR",
      fallbackLocales: ["en-US"],
      loggerOptions: { id: "test" },
    });
    expect(result).toBeUndefined();
    expect(mockReadLocaleMessages).toHaveBeenCalledTimes(2);
  });

  it("writes messages to cache only when allowCacheWrite is true", async () => {
    const enMessages: LocaleMessages = {
      "en-US": { hello: "Hello" },
    };
    mockPool.get.mockResolvedValueOnce(undefined);
    vi.mocked(mockReadLocaleMessages).mockResolvedValueOnce(enMessages);
    const result = await loadLocalMessages({
      id: "test",
      locale: "en-US",
      loggerOptions: { id: "test" },
      allowCacheWrite: true,
    });
    expect(result).toEqual(enMessages);
    expect(mockPool.set).toHaveBeenCalledTimes(1);
    expect(mockPool.set).toHaveBeenCalledWith(expect.any(String), enMessages);
  });

  it("does not write to cache when allowCacheWrite is false", async () => {
    const enMessages: LocaleMessages = {
      "en-US": { hello: "Hello" },
    };
    mockPool.get.mockResolvedValueOnce(undefined);
    vi.mocked(mockReadLocaleMessages).mockResolvedValueOnce(enMessages);
    const result = await loadLocalMessages({
      id: "test",
      locale: "en-US",
      loggerOptions: { id: "test" },
      allowCacheWrite: false,
    });
    expect(result).toEqual(enMessages);
    expect(mockPool.set).not.toHaveBeenCalled();
  });
});
