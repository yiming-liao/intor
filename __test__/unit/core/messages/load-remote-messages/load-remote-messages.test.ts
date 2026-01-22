/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MessageObject } from "intor-translator";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as loggerModule from "@/core/logger";
import * as fetchModule from "@/core/messages/load-remote-messages/fetch-remote-resource";
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
    namespaces: ["common", "error"],
    url: "https://cdn.example.com/messages",
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
    const fetchSpy = vi.spyOn(fetchModule, "fetchRemoteResource");
    const result = await loadRemoteMessages({
      ...baseParams,
      signal: controller.signal,
    });
    expect(result).toBeUndefined();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(loggerChild.debug).toHaveBeenCalled();
  });

  it("loads index and namespace resources and nests them correctly", async () => {
    const fetchSpy = vi
      .spyOn(fetchModule, "fetchRemoteResource")
      .mockImplementation(async ({ url }) => {
        if (url.endsWith("/index.json")) {
          return { app: "Intor" } as MessageObject;
        }
        if (url.endsWith("/common.json")) {
          return { title: "Hello" } as MessageObject;
        }
        if (url.endsWith("/error.json")) {
          return { notFound: "Not found" } as MessageObject;
        }
        return undefined;
      });
    const result = await loadRemoteMessages(baseParams);
    expect(fetchSpy).toHaveBeenCalledTimes(3);
    expect(result).toEqual({
      "en-US": {
        app: "Intor",
        common: {
          title: "Hello",
        },
        error: {
          notFound: "Not found",
        },
      },
    });
    expect(loggerChild.trace).toHaveBeenCalled();
  });

  it("falls back to next locale when primary locale yields no messages", async () => {
    vi.spyOn(fetchModule, "fetchRemoteResource").mockImplementation(
      async ({ url }) => {
        if (url.includes("/en-US/")) return undefined;
        if (url.endsWith("/zh-TW/index.json")) {
          return { app: "Intor TW" } as MessageObject;
        }
        return undefined;
      },
    );
    const result = await loadRemoteMessages(baseParams);
    expect(result).toEqual({
      "zh-TW": {
        app: "Intor TW",
      },
    });
  });

  it("loads only index.json when namespaces is not provided", async () => {
    vi.spyOn(fetchModule, "fetchRemoteResource").mockResolvedValue({
      app: "Intor",
    } as MessageObject);
    const result = await loadRemoteMessages({
      ...baseParams,
      namespaces: undefined,
    });
    expect(result).toEqual({
      "en-US": {
        app: "Intor",
      },
    });
  });

  it("returns undefined when all locales yield no messages", async () => {
    vi.spyOn(fetchModule, "fetchRemoteResource").mockResolvedValue(undefined);
    const result = await loadRemoteMessages(baseParams);
    expect(result).toBeUndefined();
  });

  it("falls back when primary locale throws fetch error", async () => {
    vi.spyOn(fetchModule, "fetchRemoteResource")
      .mockImplementationOnce(async () => {
        throw new Error("network error");
      })
      .mockResolvedValueOnce({ app: "Fallback OK" });
    const result = await loadRemoteMessages({
      ...baseParams,
      namespaces: undefined,
    });
    expect(result).toEqual({
      "zh-TW": {
        app: "Fallback OK",
      },
    });
    expect(loggerChild.warn).toHaveBeenCalled();
  });
});
