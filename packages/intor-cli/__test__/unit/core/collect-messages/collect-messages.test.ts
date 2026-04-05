/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "intor";
import { loadMessages, resolveLoaderOptions } from "intor/internal";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { collectMessages } from "../../../../src/core";
import { getReaders } from "../../../../src/core/collect-messages/readers/get-readers";

vi.mock("intor/internal", async (importOriginal) => {
  const actual = await importOriginal<typeof import("intor/internal")>();
  return {
    ...actual,
    loadMessages: vi.fn(),
    resolveLoaderOptions: vi.fn(),
  };
});

vi.mock("../../../../src/core/collect-messages/readers/get-readers", () => ({
  getReaders: vi.fn(),
}));

const createConfig = (overrides: Partial<IntorResolvedConfig> = {}) =>
  ({
    id: "test",
    defaultLocale: "en",
    messages: { en: { static: true } },
    ...overrides,
  }) as IntorResolvedConfig;

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getReaders).mockResolvedValue({});
  vi.mocked(resolveLoaderOptions).mockImplementation((config, target) => {
    if (target === "server") {
      return ((config as any).loader || (config as any).server?.loader) as any;
    }
    return (config as any).client?.loader as any;
  });
});

describe("collectMessages", () => {
  it("returns static messages when no loaders exist", async () => {
    const config = createConfig();
    const result = await collectMessages("en", config, {});
    expect(result.messages).toEqual({ en: { static: true } });
    expect(result.overrides).toEqual([]);
    expect(loadMessages).not.toHaveBeenCalled();
  });

  it("merges server runtime messages over static messages", async () => {
    const config = createConfig({ loader: true } as any);
    vi.mocked(loadMessages).mockResolvedValueOnce({
      en: { server: true },
    });
    const result = await collectMessages("en", config, {});
    expect(loadMessages).toHaveBeenCalledTimes(1);
    expect(result.messages).toEqual({
      en: { static: true, server: true },
    });
    expect(result.overrides).toHaveLength(1);
    expect(result.overrides[0]?.layer).toBe("runtimeOverStatic");
  });

  it("merges client runtime messages over server messages", async () => {
    const config = createConfig({
      loader: true as any,
      client: { loader: true } as any,
    });
    vi.mocked(loadMessages)
      .mockResolvedValueOnce({ en: { server: true } })
      .mockResolvedValueOnce({ en: { client: true } });
    const result = await collectMessages("en", config, {});
    expect(loadMessages).toHaveBeenCalledTimes(2);
    expect(result.messages).toEqual({
      en: {
        static: true,
        server: true,
        client: true,
      },
    });
    const layers = result.overrides.map((r) => r.layer);
    expect(layers).toContain("clientOverServer");
    expect(layers).toContain("runtimeOverStatic");
  });

  it("passes resolved readers when exts are provided", async () => {
    const config = createConfig({ loader: true } as any);
    vi.mocked(getReaders).mockResolvedValue({
      md: async () => ({}),
      yaml: async () => ({}),
    });
    vi.mocked(loadMessages).mockResolvedValueOnce({ en: {} });
    await collectMessages("en", config, { exts: ["md", "yaml"] });
    const call = vi.mocked(loadMessages).mock.calls[0]?.[0];
    expect(call?.readers).toHaveProperty("md");
    expect(call?.readers).toHaveProperty("yaml");
  });

  it("resolves and passes custom readers", async () => {
    const config = createConfig({ loader: true } as any);
    vi.mocked(getReaders).mockResolvedValue({
      foo: async () => ({}),
    });
    vi.mocked(loadMessages).mockResolvedValueOnce({ en: {} });
    await collectMessages("en", config, {
      exts: [],
      customReaders: { foo: "/custom/reader.ts" },
    });
    const call = vi.mocked(loadMessages).mock.calls[0]?.[0];
    expect(call?.readers).toHaveProperty("foo");
  });

  it("skips server and client loaders when none are defined", async () => {
    const config = createConfig({ loader: false, client: undefined } as any);
    const result = await collectMessages("en", config, {});
    expect(result.messages).toEqual({ en: { static: true } });
    expect(result.overrides).toEqual([]);
    expect(loadMessages).not.toHaveBeenCalled();
  });

  it("skips server load when resolved server loader is undefined", async () => {
    const config = createConfig({ loader: true } as any);
    vi.mocked(resolveLoaderOptions).mockReturnValueOnce(undefined);

    const result = await collectMessages("en", config, {});
    expect(loadMessages).not.toHaveBeenCalled();
    expect(result.messages).toEqual({ en: { static: true } });
  });

  it("skips client load when resolved client loader is undefined", async () => {
    const config = createConfig({
      loader: true as any,
      client: { loader: true } as any,
    });

    vi.mocked(resolveLoaderOptions)
      .mockReturnValueOnce({} as any) // server
      .mockReturnValueOnce(undefined); // client

    vi.mocked(loadMessages).mockResolvedValueOnce({ en: { server: true } });

    const result = await collectMessages("en", config, {});
    expect(loadMessages).toHaveBeenCalledTimes(1); // only server called
    expect(result.messages).toEqual({ en: { static: true, server: true } });
  });
});
