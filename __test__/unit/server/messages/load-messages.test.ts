/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as coreModule from "../../../../src/core";
import * as loggerModule from "../../../../src/core/logger";
import * as localModule from "../../../../src/server/messages/load-local-messages";
import { loadMessages } from "../../../../src/server/messages/load-messages";

describe("loadMessages()", () => {
  const info = vi.fn();
  const trace = vi.fn();
  const warn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(loggerModule, "getLogger").mockReturnValue({
      child: () => ({ info, trace, warn }),
    } as any);
  });

  function baseConfig(overrides: any = {}) {
    return {
      id: "test",
      logger: { id: "test" },
      fallbackLocales: { en: ["zh"] },
      ...overrides,
    };
  }

  it("returns early when no loader configured", async () => {
    vi.spyOn(coreModule, "resolveLoaderOptions").mockReturnValue(undefined);
    const result = await loadMessages({
      config: baseConfig(),
      locale: "en",
      fetch,
    } as any);
    expect(result).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      "No loader options have been configured in the current config.",
    );
  });

  it("delegates to local loader with all options", async () => {
    vi.spyOn(coreModule, "resolveLoaderOptions").mockReturnValue({
      mode: "local",
      rootDir: "messages",
      namespaces: ["common"],
      concurrency: 3,
    } as any);
    vi.spyOn(localModule, "loadLocalMessages").mockResolvedValue({
      en: { hello: "local" },
    });
    const result = await loadMessages({
      config: baseConfig(),
      locale: "en",
      readers: { json: vi.fn() },
      allowCacheWrite: true,
      fetch,
    } as any);
    expect(localModule.loadLocalMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "test",
        locale: "en",
        fallbackLocales: ["zh"],
        namespaces: ["common"],
        rootDir: "messages",
        concurrency: 3,
        allowCacheWrite: true,
        readers: expect.any(Object),
      }),
    );
    expect(result).toEqual({ en: { hello: "local" } });
  });

  it("omits undefined local options and defaults readers + allowCacheWrite", async () => {
    vi.spyOn(coreModule, "resolveLoaderOptions").mockReturnValue({
      mode: "local",
    } as any);
    vi.spyOn(localModule, "loadLocalMessages").mockResolvedValue({});
    await loadMessages({
      config: baseConfig(),
      locale: "en",
      fetch,
    } as any);
    const call = vi.mocked(localModule.loadLocalMessages).mock.calls[0]![0];
    expect("namespaces" in call).toBe(false);
    expect("rootDir" in call).toBe(false);
    expect("concurrency" in call).toBe(false);
    expect(call.readers).toEqual({});
    expect(call.allowCacheWrite).toBe(false);
  });

  it("delegates to remote loader with full options", async () => {
    vi.spyOn(coreModule, "resolveLoaderOptions").mockReturnValue({
      mode: "remote",
      url: "https://api.example.com",
      headers: { Authorization: "x" },
      namespaces: ["common"],
      concurrency: 5,
    } as any);
    vi.spyOn(coreModule, "loadRemoteMessages").mockResolvedValue({
      en: { hello: "remote" },
    });
    const result = await loadMessages({
      config: baseConfig(),
      locale: "en",
      fetch,
    } as any);
    expect(coreModule.loadRemoteMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "en",
        fallbackLocales: ["zh"],
        url: "https://api.example.com",
        headers: { Authorization: "x" },
        namespaces: ["common"],
        concurrency: 5,
      }),
    );
    expect(result).toEqual({ en: { hello: "remote" } });
  });

  it("omits undefined remote optional fields", async () => {
    vi.spyOn(coreModule, "resolveLoaderOptions").mockReturnValue({
      mode: "remote",
      url: "https://api.example.com",
    } as any);
    vi.spyOn(coreModule, "loadRemoteMessages").mockResolvedValue({});
    await loadMessages({
      config: baseConfig(),
      locale: "en",
      fetch,
    } as any);
    const call = vi.mocked(coreModule.loadRemoteMessages).mock.calls[0]![0];
    expect("namespaces" in call).toBe(false);
    expect("headers" in call).toBe(false);
    expect("concurrency" in call).toBe(false);
  });

  it("handles missing fallbackLocales entry", async () => {
    vi.spyOn(coreModule, "resolveLoaderOptions").mockReturnValue({
      mode: "remote",
      url: "x",
    } as any);
    vi.spyOn(coreModule, "loadRemoteMessages").mockResolvedValue({});
    await loadMessages({
      config: baseConfig({ fallbackLocales: {} }),
      locale: "ja",
      fetch,
    } as any);
    const call = vi.mocked(coreModule.loadRemoteMessages).mock.calls[0]![0];
    expect(call.fallbackLocales).toEqual([]);
  });

  it("warns when loadedMessages is undefined", async () => {
    vi.spyOn(coreModule, "resolveLoaderOptions").mockReturnValue({
      mode: "remote",
      url: "x",
    } as any);
    vi.spyOn(coreModule, "loadRemoteMessages").mockResolvedValue(undefined);
    await loadMessages({
      config: baseConfig(),
      locale: "en",
      fetch,
    } as any);
    expect(warn).toHaveBeenCalledWith(
      "No messages found.",
      expect.objectContaining({ locale: "en" }),
    );
  });

  it("warns when loadedMessages is empty object", async () => {
    vi.spyOn(coreModule, "resolveLoaderOptions").mockReturnValue({
      mode: "remote",
      url: "x",
    } as any);
    vi.spyOn(coreModule, "loadRemoteMessages").mockResolvedValue({});
    await loadMessages({
      config: baseConfig(),
      locale: "en",
      fetch,
    } as any);
    expect(warn).toHaveBeenCalledWith(
      "No messages found.",
      expect.objectContaining({ locale: "en" }),
    );
  });

  it("does nothing when loader mode is unknown", async () => {
    vi.spyOn(coreModule, "resolveLoaderOptions").mockReturnValue({
      mode: "unknown",
    } as any);
    const result = await loadMessages({
      config: baseConfig(),
      locale: "en",
      fetch,
    } as any);
    expect(coreModule.loadRemoteMessages).not.toHaveBeenCalled();
    expect(localModule.loadLocalMessages).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      "No messages found.",
      expect.objectContaining({ locale: "en" }),
    );
  });
});
