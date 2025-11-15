/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LimitFunction } from "p-limit";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadLocaleWithFallback } from "@/modules/messages/load-local-messages/load-locale-with-fallback";
import * as singleLocaleModule from "@/modules/messages/load-local-messages/load-single-locale";
import * as loggerModule from "@/shared/logger/get-logger";

describe("loadLocaleWithFallback", () => {
  const mockLogger = {
    warn: vi.fn(),
    child: vi.fn(() => mockLogger),
  };

  const limit = vi.fn(async (fn: () => any) =>
    fn(),
  ) as unknown as LimitFunction;
  const messages: Record<string, any> = {};

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns valid namespaces when target locale loads successfully", async () => {
    vi.spyOn(loggerModule, "getLogger").mockReturnValue(mockLogger as any);
    vi.spyOn(singleLocaleModule, "loadSingleLocale").mockResolvedValue([
      "ns1",
      "ns2",
    ]);

    const result = await loadLocaleWithFallback({
      basePath: "/fake/path",
      locale: "en-US",
      fallbackLocales: ["fr-FR"],
      namespaces: ["ns1"],
      messages,
      limit,
      logger: { id: "test" },
    });

    expect(result).toEqual(["ns1", "ns2"]);
    expect(singleLocaleModule.loadSingleLocale).toHaveBeenCalledTimes(1);
    expect(singleLocaleModule.loadSingleLocale).toHaveBeenCalledWith(
      expect.objectContaining({ locale: "en-US" }),
    );
  });

  it("returns valid namespaces when target locale fails but fallback succeeds", async () => {
    vi.spyOn(loggerModule, "getLogger").mockReturnValue(mockLogger as any);
    const loadMock = vi.spyOn(singleLocaleModule, "loadSingleLocale");
    loadMock.mockRejectedValueOnce(new Error("fail target"));
    loadMock.mockResolvedValueOnce(["fallbackNs"]);

    const result = await loadLocaleWithFallback({
      basePath: "/fake/path",
      locale: "en-US",
      fallbackLocales: ["fr-FR"],
      namespaces: ["ns1"],
      messages,
      limit,
      logger: { id: "test" },
    });

    expect(result).toEqual(["fallbackNs"]);
    expect(loadMock).toHaveBeenCalledTimes(2);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      "Error occurred while processing the locale.",
      expect.objectContaining({ locale: "en-US" }),
    );
  });

  it("returns undefined when all locales fail", async () => {
    vi.spyOn(loggerModule, "getLogger").mockReturnValue(mockLogger as any);
    const loadMock = vi.spyOn(singleLocaleModule, "loadSingleLocale");
    loadMock.mockRejectedValue(new Error("fail"));

    const result = await loadLocaleWithFallback({
      basePath: "/fake/path",
      locale: "en-US",
      fallbackLocales: ["fr-FR"],
      namespaces: ["ns1"],
      messages,
      limit,
      logger: { id: "test" },
    });

    expect(result).toBeUndefined();
    expect(loadMock).toHaveBeenCalledTimes(2);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      "All fallback locales failed.",
      expect.objectContaining({ attemptedLocales: ["en-US", "fr-FR"] }),
    );
  });
});
