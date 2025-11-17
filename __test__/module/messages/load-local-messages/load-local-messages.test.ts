/* eslint-disable @typescript-eslint/no-explicit-any */

import type { LocaleMessages } from "intor-translator";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadLocalMessages } from "@/modules/messages/load-local-messages/load-local-messages";
import * as readModule from "@/modules/messages/load-local-messages/read-locale-messages";
import * as loggerModule from "@/shared/logger/get-logger";
import { getGlobalMessagesPool } from "@/shared/messages/global-messages-pool";

const loggerChildMock = { debug: vi.fn(), trace: vi.fn(), error: vi.fn() };
const loggerMock = {
  child: vi.fn().mockReturnValue(loggerChildMock),
  core: { level: "debug" },
};

vi.spyOn(loggerModule, "getLogger").mockImplementation(() => loggerMock as any);
vi.mock(
  "@/modules/messages/load-local-messages/read-locale-messages/read-locale-messages",
);
vi.mock("@/shared/messages/global-messages-pool");

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
      extraOptions: {},
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
      extraOptions: {},
    });

    expect(result).toEqual(enMessages);
    expect(mockReadLocaleMessages).toHaveBeenCalledTimes(2);
  });

  it("should return cached messages if available", async () => {
    const cached: LocaleMessages = { "en-US": { hello: "Cached" } };

    mockPool.get.mockImplementation(async () => cached);

    const result = await loadLocalMessages({
      locale: "en-US",
      extraOptions: { cacheOptions: { enabled: true, ttl: 60 * 60 * 1000 } },
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
      extraOptions: {},
    });

    expect(result).toBeUndefined();
    expect(mockReadLocaleMessages).toHaveBeenCalledTimes(2);
  });

  it("should ignore cache if cache is disabled", async () => {
    const enMessages: LocaleMessages = { "en-US": { hello: "Hello" } };
    vi.mocked(mockReadLocaleMessages).mockResolvedValueOnce(enMessages);

    const result = await loadLocalMessages({
      locale: "en-US",
      extraOptions: { cacheOptions: { enabled: false, ttl: 60 * 60 * 1000 } },
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
      extraOptions: {},
    });

    expect(result).toEqual(enMessages);
    expect(mockReadLocaleMessages).toHaveBeenCalledTimes(2);
  });
});
