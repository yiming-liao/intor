/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "@/config";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { initTranslator } from "@/server/translator";

vi.mock("@/core", () => ({
  resolveLoaderOptions: vi.fn(),
  createTranslator: vi.fn(),
}));

vi.mock("@/server/messages", () => ({
  loadMessages: vi.fn(),
}));

const mockConfig = {
  id: "test",
} as unknown as IntorResolvedConfig;

const mockTranslator = {
  locale: "en",
  messages: {},
  t: vi.fn(),
  hasKey: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("initTranslator", () => {
  it("loads messages and creates translator snapshot when loader is enabled", async () => {
    const { resolveLoaderOptions } = await import("@/core");
    const { loadMessages } = await import("@/server/messages");
    const { createTranslator } = await import("@/core");
    vi.mocked(resolveLoaderOptions).mockReturnValue({ type: "local" } as any);
    vi.mocked(loadMessages).mockResolvedValue({ en: { hello: "world" } });
    vi.mocked(createTranslator).mockReturnValue(mockTranslator as any);
    const result = await initTranslator(mockConfig, "en", {
      allowCacheWrite: true,
    } as any);
    expect(loadMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        config: mockConfig,
        locale: "en",
        readers: undefined,
        allowCacheWrite: true,
        fetch: undefined,
      }),
    );
    expect(createTranslator).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "en",
        messages: { en: { hello: "world" } },
      }),
    );
    expect(result).toBe(mockTranslator);
  });

  it("skips message loading when no loader is configured", async () => {
    const { resolveLoaderOptions } = await import("@/core");
    const { loadMessages } = await import("@/server/messages");
    const { createTranslator } = await import("@/core");
    vi.mocked(resolveLoaderOptions).mockReturnValue(undefined);
    vi.mocked(createTranslator).mockReturnValue(mockTranslator as any);
    await initTranslator(mockConfig, "en", {} as any);
    expect(loadMessages).not.toHaveBeenCalled();
    expect(createTranslator).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: {},
      }),
    );
  });

  it("normalizes undefined messages to empty object", async () => {
    const { resolveLoaderOptions } = await import("@/core");
    const { loadMessages } = await import("@/server/messages");
    const { createTranslator } = await import("@/core");
    vi.mocked(resolveLoaderOptions).mockReturnValue({ type: "local" } as any);
    vi.mocked(loadMessages).mockResolvedValue(undefined);
    vi.mocked(createTranslator).mockReturnValue(mockTranslator as any);
    await initTranslator(mockConfig, "en", {} as any);
    expect(createTranslator).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: {},
      }),
    );
  });

  it("defaults allowCacheWrite to false when not provided", async () => {
    const { resolveLoaderOptions } = await import("@/core");
    const { loadMessages } = await import("@/server/messages");
    vi.mocked(resolveLoaderOptions).mockReturnValue({ type: "local" } as any);
    vi.mocked(loadMessages).mockResolvedValue({});
    await initTranslator(mockConfig, "en", {} as any);
    expect(loadMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        allowCacheWrite: false,
      }),
    );
  });

  it("passes fetch through when provided", async () => {
    const { resolveLoaderOptions } = await import("@/core");
    const { loadMessages } = await import("@/server/messages");
    const mockFetch = vi.fn();
    vi.mocked(resolveLoaderOptions).mockReturnValue({ type: "local" } as any);
    vi.mocked(loadMessages).mockResolvedValue({});
    await initTranslator(mockConfig, "en", {
      fetch: mockFetch,
    });
    expect(loadMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        fetch: mockFetch,
      }),
    );
  });
});
