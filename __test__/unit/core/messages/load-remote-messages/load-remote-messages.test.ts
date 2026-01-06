/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LocaleMessages } from "intor-translator";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as loggerModule from "@/core/logger";
import * as fetchModule from "@/core/messages/load-remote-messages/fetch-locale-messages";
import { loadRemoteMessages } from "@/core/messages/load-remote-messages/load-remote-messages";

describe("loadRemoteMessages", () => {
  const loggerChild = {
    debug: vi.fn(),
    trace: vi.fn(),
    warn: vi.fn(),
  };

  const logger = {
    child: vi.fn(() => loggerChild),
  };

  const baseParams = {
    locale: "en-US",
    fallbackLocales: ["zh-TW"],
    namespaces: ["common"],
    rootDir: "messages",
    url: "https://api.example.com/messages",
    headers: { Authorization: "Bearer token" },
    loggerOptions: { id: "test" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(loggerModule, "getLogger").mockReturnValue(logger as any);
  });

  it("returns early if signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    const fetchSpy = vi.spyOn(fetchModule, "fetchLocaleMessages");
    const result = await loadRemoteMessages({
      ...baseParams,
      signal: controller.signal,
    });
    expect(result).toBeUndefined();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(loggerChild.debug).toHaveBeenCalled();
  });

  it("tries fallback locale when primary locale has no messages", async () => {
    const fetchSpy = vi
      .spyOn(fetchModule, "fetchLocaleMessages")
      .mockResolvedValueOnce({ "en-US": {} })
      .mockResolvedValueOnce({
        "zh-TW": { hello: "fallback" },
      });
    const result = await loadRemoteMessages(baseParams);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy.mock.calls[0][0].locale).toBe("en-US");
    expect(fetchSpy.mock.calls[1][0].locale).toBe("zh-TW");
    expect(result).toEqual({
      "zh-TW": { hello: "fallback" },
    });
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
    });
    expect(result).toBeUndefined();
    expect(loggerChild.debug).toHaveBeenCalled();
  });

  it("returns undefined and warns when all locales fail", async () => {
    vi.spyOn(fetchModule, "fetchLocaleMessages").mockRejectedValue(
      new Error("network error"),
    );
    const result = await loadRemoteMessages(baseParams);
    expect(result).toBeUndefined();
    expect(loggerChild.warn).toHaveBeenCalled();
  });

  it("returns messages when primary locale resolves successfully", async () => {
    const fetched: LocaleMessages = {
      "en-US": { hello: "world" },
    };
    vi.spyOn(fetchModule, "fetchLocaleMessages").mockResolvedValue(fetched);
    const result = await loadRemoteMessages(baseParams);
    expect(result).toEqual(fetched);
    expect(loggerChild.trace).toHaveBeenCalled();
  });
});
