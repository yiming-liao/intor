/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "../../../../src/config";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { initTranslator } from "../../../../src/server/translator";

vi.mock("../../../../src/core", () => ({
  resolveLoaderOptions: vi.fn(),
  createTranslator: vi.fn(),
}));

vi.mock("../../../../src/server/messages", () => ({
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
  it("loads messages via built-in loader when loaderOptions are enabled", async () => {
    const { resolveLoaderOptions, createTranslator } = await import(
      "../../../../src/core"
    );
    const { loadMessages } = await import("../../../../src/server/messages");
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
        allowCacheWrite: true,
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

  it("uses custom loader when provided and skips built-in loadMessages", async () => {
    const { resolveLoaderOptions, createTranslator } = await import(
      "../../../../src/core"
    );
    const { loadMessages } = await import("../../../../src/server/messages");
    const customLoader = vi.fn().mockResolvedValue({
      en: { hello: "from-loader" },
    });
    vi.mocked(resolveLoaderOptions).mockReturnValue({ type: "local" } as any);
    vi.mocked(createTranslator).mockReturnValue(mockTranslator as any);
    await initTranslator(mockConfig, "en", {
      loader: customLoader,
    } as any);
    expect(customLoader).toHaveBeenCalledWith(mockConfig, "en");
    expect(loadMessages).not.toHaveBeenCalled();
    expect(createTranslator).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: { en: { hello: "from-loader" } },
      }),
    );
  });

  it("does not load messages when loaderOptions are disabled", async () => {
    const { resolveLoaderOptions, createTranslator } = await import(
      "../../../../src/core"
    );
    const { loadMessages } = await import("../../../../src/server/messages");
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

  it("normalizes undefined messages from built-in loader to empty object", async () => {
    const { resolveLoaderOptions, createTranslator } = await import(
      "../../../../src/core"
    );
    const { loadMessages } = await import("../../../../src/server/messages");
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

  it("defaults allowCacheWrite to false", async () => {
    const { resolveLoaderOptions } = await import("../../../../src/core");
    const { loadMessages } = await import("../../../../src/server/messages");
    vi.mocked(resolveLoaderOptions).mockReturnValue({ type: "local" } as any);
    vi.mocked(loadMessages).mockResolvedValue({});
    await initTranslator(mockConfig, "en", {} as any);
    expect(loadMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        allowCacheWrite: false,
      }),
    );
  });

  it("passes fetch through to built-in loader when provided", async () => {
    const { resolveLoaderOptions } = await import("../../../../src/core");
    const { loadMessages } = await import("../../../../src/server/messages");
    const mockFetch = vi.fn();
    vi.mocked(resolveLoaderOptions).mockReturnValue({ type: "local" } as any);
    vi.mocked(loadMessages).mockResolvedValue({});
    await initTranslator(mockConfig, "en", {
      fetch: mockFetch,
    } as any);
    expect(loadMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        fetch: mockFetch,
      }),
    );
  });
});
