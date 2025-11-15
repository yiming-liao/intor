/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadLocalMessages } from "@/modules/messages/load-local-messages/load-local-messages";
import * as loadFallbackModule from "@/modules/messages/load-local-messages/load-locale-with-fallback";
import * as loggerModule from "@/shared/logger/get-logger";
import * as poolModule from "@/shared/messages/global-messages-pool";

describe("loadLocalMessages", () => {
  const mockLogger = {
    trace: vi.fn(),
    debug: vi.fn(),
    child: vi.fn(() => mockLogger),
  };

  const mockPool = {
    get: vi.fn(),
    set: vi.fn(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns empty object when locale is missing", async () => {
    const result = await loadLocalMessages({ basePath: "msgs", locale: "" });
    expect(result).toEqual({});
  });

  it("returns cached messages when cache hit", async () => {
    vi.spyOn(loggerModule, "getLogger").mockReturnValue(mockLogger as any);
    vi.spyOn(poolModule, "getGlobalMessagesPool").mockReturnValue(
      mockPool as any,
    );
    mockPool.get.mockResolvedValue({ cached: "value" });

    const result = await loadLocalMessages({
      basePath: "msgs",
      locale: "en-US",
      cache: { enabled: true, ttl: 1000 },
    });

    expect(result).toEqual({ cached: "value" });
    expect(mockLogger.debug).toHaveBeenCalledWith(
      "Messages cache hit.",
      expect.objectContaining({ key: expect.any(String) }),
    );
  });

  it("loads messages via loadLocaleWithFallback and caches them", async () => {
    vi.spyOn(loggerModule, "getLogger").mockReturnValue(mockLogger as any);
    vi.spyOn(poolModule, "getGlobalMessagesPool").mockReturnValue(
      mockPool as any,
    );
    mockPool.get.mockResolvedValue(undefined);

    const loadFallbackSpy = vi
      .spyOn(loadFallbackModule, "loadLocaleWithFallback")
      .mockResolvedValue(["ns1"]);

    const messages = await loadLocalMessages({
      basePath: "msgs",
      locale: "en-US",
      cache: { enabled: true, ttl: 1000 },
    });

    expect(loadFallbackSpy).toHaveBeenCalled();
    expect(messages).toBeDefined();
    expect(mockPool.set).toHaveBeenCalledWith(
      expect.any(String),
      messages,
      1000,
    );
    expect(mockLogger.trace).toHaveBeenCalledWith(
      "Finished loading local messages.",
      expect.objectContaining({ validNamespaces: ["ns1"] }),
    );
  });
});
