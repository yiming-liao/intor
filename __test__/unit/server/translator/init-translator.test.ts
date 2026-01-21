/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "@/config";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { initTranslator } from "@/server/translator";

vi.mock("@/core", () => ({
  resolveLoaderOptions: vi.fn(),
}));

vi.mock("@/server/messages", () => ({
  loadMessages: vi.fn(),
}));

vi.mock("@/server/translator/create-translator", () => ({
  createTranslator: vi.fn(),
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
    const { createTranslator } = await import(
      "@/server/translator/create-translator"
    );
    vi.mocked(resolveLoaderOptions).mockReturnValue({ type: "local" } as any);
    vi.mocked(loadMessages).mockResolvedValue({ en: { hello: "world" } });
    vi.mocked(createTranslator).mockReturnValue(mockTranslator as any);
    const result = await initTranslator(mockConfig, "en", {
      allowCacheWrite: true,
    }); // --- loadMessages is called with normalized options
    expect(loadMessages).toHaveBeenCalledWith({
      config: mockConfig,
      locale: "en",
      readers: undefined,
      allowCacheWrite: true,
    }); // --- translator snapshot uses loaded messages
    expect(createTranslator).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "en",
        messages: { en: { hello: "world" } },
      }),
    ); // --- returned value is the snapshot
    expect(result).toBe(mockTranslator);
  });

  it("skips message loading when no loader is configured", async () => {
    const { resolveLoaderOptions } = await import("@/core");
    const { loadMessages } = await import("@/server/messages");
    const { createTranslator } = await import(
      "@/server/translator/create-translator"
    );
    vi.mocked(resolveLoaderOptions).mockReturnValue(undefined);
    vi.mocked(createTranslator).mockReturnValue(mockTranslator as any);
    await initTranslator(mockConfig, "en"); // --- loadMessages must not be called
    expect(loadMessages).not.toHaveBeenCalled(); // --- translator is still created with empty messages
    expect(createTranslator).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: {},
      }),
    );
  });

  it("normalizes undefined messages to empty object", async () => {
    const { resolveLoaderOptions } = await import("@/core");
    const { loadMessages } = await import("@/server/messages");
    const { createTranslator } = await import(
      "@/server/translator/create-translator"
    );
    vi.mocked(resolveLoaderOptions).mockReturnValue({ type: "local" } as any);
    vi.mocked(loadMessages).mockResolvedValue(undefined);
    vi.mocked(createTranslator).mockReturnValue(mockTranslator as any);
    await initTranslator(mockConfig, "en");
    expect(createTranslator).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: {},
      }),
    );
  });

  it("defaults allowCacheWrite to false when options are not provided", async () => {
    const { resolveLoaderOptions } = await import("@/core");
    const { loadMessages } = await import("@/server/messages");
    const { createTranslator } = await import(
      "@/server/translator/create-translator"
    );
    vi.mocked(resolveLoaderOptions).mockReturnValue({ type: "local" } as any);
    vi.mocked(loadMessages).mockResolvedValue({});
    vi.mocked(createTranslator).mockReturnValue(mockTranslator as any);
    await initTranslator(mockConfig, "en");
    expect(loadMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        allowCacheWrite: false,
      }),
    );
  });
});
