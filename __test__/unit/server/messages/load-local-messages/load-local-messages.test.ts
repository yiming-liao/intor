/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LocaleMessages } from "intor-translator";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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
};

vi.spyOn(loggerModule, "getLogger").mockImplementation(() => loggerMock as any);

vi.mock("@/server/messages/load-local-messages/read-locale-messages");
vi.mock("@/core/messages/global-messages-pool");

describe("loadLocalMessages", () => {
  const mockReadLocaleMessages = vi.mocked(readModule.readLocaleMessages);

  const mockPool = {
    get: vi.fn(),
    set: vi.fn(),
  };

  vi.mocked(getGlobalMessagesPool).mockReturnValue(mockPool as any);

  const ORIGINAL_ENV = process.env.NODE_ENV;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NODE_ENV = "test";
  });

  afterEach(() => {
    process.env.NODE_ENV = ORIGINAL_ENV;
  });

  it("returns cached messages when present in process-level cache", async () => {
    const cached: LocaleMessages = {
      "en-US": { hello: "Cached" },
    };
    mockPool.get.mockReturnValueOnce(cached);
    const result = await loadLocalMessages({
      id: "test",
      locale: "en-US",
      loggerOptions: { id: "test" },
    });
    expect(result).toEqual(cached);
    expect(mockPool.get).toHaveBeenCalledTimes(1);
    expect(mockReadLocaleMessages).not.toHaveBeenCalled();
  });

  it("loads messages when cache is empty", async () => {
    const messages: LocaleMessages = {
      "en-US": { hello: "Hello" },
    };
    mockPool.get.mockReturnValueOnce(undefined);
    mockReadLocaleMessages.mockResolvedValueOnce(messages);
    const result = await loadLocalMessages({
      id: "test",
      locale: "en-US",
      loggerOptions: { id: "test" },
    });
    expect(result).toEqual(messages);
    expect(mockReadLocaleMessages).toHaveBeenCalledTimes(1);
  });

  it("tries fallback locales in order", async () => {
    const messages: LocaleMessages = {
      "en-US": { hello: "Hello" },
    };
    mockPool.get.mockReturnValueOnce(undefined);
    mockReadLocaleMessages
      .mockRejectedValueOnce(new Error("fail fr-FR"))
      .mockResolvedValueOnce(messages);
    const result = await loadLocalMessages({
      id: "test",
      locale: "fr-FR",
      fallbackLocales: ["en-US"],
      loggerOptions: { id: "test" },
    });
    expect(result).toEqual(messages);
    expect(mockReadLocaleMessages).toHaveBeenCalledTimes(2);
  });

  it("continues when messages are empty", async () => {
    const messages: LocaleMessages = {
      "en-US": { hello: "Hello" },
    };
    mockPool.get.mockReturnValueOnce(undefined);
    mockReadLocaleMessages
      .mockResolvedValueOnce({ "fr-FR": {} })
      .mockResolvedValueOnce(messages);
    const result = await loadLocalMessages({
      id: "test",
      locale: "fr-FR",
      fallbackLocales: ["en-US"],
      loggerOptions: { id: "test" },
    });
    expect(result).toEqual(messages);
    expect(mockReadLocaleMessages).toHaveBeenCalledTimes(2);
  });

  it("returns undefined if all locales fail", async () => {
    mockPool.get.mockReturnValueOnce(undefined);
    mockReadLocaleMessages
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

  it("writes to cache only in production when allowCacheWrite is true", async () => {
    process.env.NODE_ENV = "production";
    const messages: LocaleMessages = {
      "en-US": { hello: "Hello" },
    };
    mockPool.get.mockReturnValueOnce(undefined);
    mockReadLocaleMessages.mockResolvedValueOnce(messages);
    const result = await loadLocalMessages({
      id: "test",
      locale: "en-US",
      allowCacheWrite: true,
      loggerOptions: { id: "test" },
    });
    expect(result).toEqual(messages);
    expect(mockPool.set).toHaveBeenCalledTimes(1);
    expect(mockPool.set).toHaveBeenCalledWith(expect.any(String), messages);
  });

  it("does not write to cache when not in production", async () => {
    const messages: LocaleMessages = {
      "en-US": { hello: "Hello" },
    };
    mockPool.get.mockReturnValueOnce(undefined);
    mockReadLocaleMessages.mockResolvedValueOnce(messages);
    await loadLocalMessages({
      id: "test",
      locale: "en-US",
      allowCacheWrite: true,
      loggerOptions: { id: "test" },
    });
    expect(mockPool.set).not.toHaveBeenCalled();
  });
});
