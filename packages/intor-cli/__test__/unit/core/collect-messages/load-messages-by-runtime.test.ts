/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig, MessagesReaders } from "intor";
import { loadMessages, resolveLoaderOptions } from "intor/internal";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadMessagesByRuntime } from "../../../../src/core/collect-messages/load-messages-by-runtime";

vi.mock("intor/internal", async (importOriginal) => {
  const actual = await importOriginal<typeof import("intor/internal")>();
  return {
    ...actual,
    loadMessages: vi.fn(),
    resolveLoaderOptions: vi.fn(),
  };
});

const createConfig = (
  overrides: Partial<IntorResolvedConfig> = {},
): IntorResolvedConfig =>
  ({
    id: "test",
    defaultLocale: "en",
    supportedLocales: ["en"],
    messages: { en: { hello: "hi" } },
    ...overrides,
  }) as IntorResolvedConfig;

const readers: MessagesReaders = {
  md: (async () => ({})) as any,
};

describe("loadMessagesByRuntime", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns undefined when server runtime has no loader", async () => {
    const config = createConfig({
      loader: undefined,
      server: undefined,
    } as any);
    const result = await loadMessagesByRuntime("server", {
      config,
      locale: "en",
      readers,
    });
    expect(result).toBeUndefined();
    expect(resolveLoaderOptions).not.toHaveBeenCalled();
    expect(loadMessages).not.toHaveBeenCalled();
  });

  it("returns undefined when client runtime has no loader", async () => {
    const config = createConfig({ client: undefined } as any);
    const result = await loadMessagesByRuntime("client", {
      config,
      locale: "en",
      readers,
    });
    expect(result).toBeUndefined();
    expect(resolveLoaderOptions).not.toHaveBeenCalled();
    expect(loadMessages).not.toHaveBeenCalled();
  });

  it("returns undefined when resolved loader is missing", async () => {
    const config = createConfig({ loader: true } as any);
    vi.mocked(resolveLoaderOptions).mockReturnValueOnce(undefined);
    const result = await loadMessagesByRuntime("server", {
      config,
      locale: "en",
      readers,
    });
    expect(result).toBeUndefined();
    expect(resolveLoaderOptions).toHaveBeenCalledWith(config, "server");
    expect(loadMessages).not.toHaveBeenCalled();
  });

  it("loads server runtime messages when loader is resolved", async () => {
    const config = createConfig({ loader: true } as any);
    vi.mocked(resolveLoaderOptions).mockReturnValueOnce({
      source: "server",
    } as any);
    vi.mocked(loadMessages).mockResolvedValueOnce({
      en: { server: true },
    } as any);
    const result = await loadMessagesByRuntime("server", {
      config,
      locale: "en",
      readers,
    });
    expect(resolveLoaderOptions).toHaveBeenCalledWith(config, "server");
    expect(loadMessages).toHaveBeenCalledTimes(1);
    const call = vi.mocked(loadMessages).mock.calls[0]?.[0];
    expect(call?.config).toEqual({ ...config, loader: { source: "server" } });
    expect(call?.locale).toBe("en");
    expect(call?.readers).toBe(readers);
    expect(call?.fetch).toBe(globalThis.fetch);
    expect(result).toEqual({ en: { server: true } });
  });

  it("loads client runtime messages when loader is resolved", async () => {
    const config = createConfig({ client: { loader: true } } as any);
    vi.mocked(resolveLoaderOptions).mockReturnValueOnce({
      source: "client",
    } as any);
    vi.mocked(loadMessages).mockResolvedValueOnce({
      en: { client: true },
    } as any);
    const result = await loadMessagesByRuntime("client", {
      config,
      locale: "en",
      readers,
    });
    expect(resolveLoaderOptions).toHaveBeenCalledWith(config, "client");
    expect(loadMessages).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ en: { client: true } });
  });

  it("treats server config.server.loader as available loader", async () => {
    const config = createConfig({ server: { loader: true } } as any);
    vi.mocked(resolveLoaderOptions).mockReturnValueOnce({
      from: "server",
    } as any);
    vi.mocked(loadMessages).mockResolvedValueOnce({ en: { ok: true } } as any);
    const result = await loadMessagesByRuntime("server", {
      config,
      locale: "en",
      readers,
    });
    expect(resolveLoaderOptions).toHaveBeenCalledWith(config, "server");
    expect(loadMessages).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ en: { ok: true } });
  });
});
