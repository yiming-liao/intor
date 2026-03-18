/* eslint-disable @typescript-eslint/consistent-type-imports */

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "intor";
import { loadMessages } from "intor/internal";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { collectRuntimeMessages } from "../../../../src/core";

vi.mock("intor/internal", async (importOriginal) => {
  const actual = await importOriginal<typeof import("intor/internal")>();
  return {
    ...actual,
    loadMessages: vi.fn(),
  };
});

vi.mock(
  "../../../../src/core/collect-messages/resolve-messages-reader",
  () => ({
    resolveMessagesReader: vi.fn(async () => async () => ({ custom: true })),
  }),
);

const createConfig = (overrides: Partial<IntorResolvedConfig> = {}) =>
  ({
    id: "test",
    defaultLocale: "en",
    messages: { en: { static: true } },
    ...overrides,
  }) as IntorResolvedConfig;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("collectRuntimeMessages", () => {
  it("returns static messages when no loaders exist", async () => {
    const config = createConfig();
    const result = await collectRuntimeMessages(config, "en", {});
    expect(result.messages).toEqual({ en: { static: true } });
    expect(result.overrides).toEqual([]);
    expect(loadMessages).not.toHaveBeenCalled();
  });

  it("merges server runtime messages over static messages", async () => {
    const config = createConfig({ loader: true } as any);
    vi.mocked(loadMessages).mockResolvedValueOnce({
      en: { server: true },
    });
    const result = await collectRuntimeMessages(config, "en", {});
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
    const result = await collectRuntimeMessages(config, "en", {});
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
    vi.mocked(loadMessages).mockResolvedValueOnce({ en: {} });
    await collectRuntimeMessages(config, "en", { exts: ["md", "yaml"] });
    const call = vi.mocked(loadMessages).mock.calls[0]?.[0];
    expect(call?.readers).toHaveProperty("md");
    expect(call?.readers).toHaveProperty("yaml");
  });

  it("resolves and passes custom readers", async () => {
    const config = createConfig({ loader: true } as any);
    vi.mocked(loadMessages).mockResolvedValueOnce({ en: {} });
    await collectRuntimeMessages(config, "en", {
      exts: [],
      customReaders: { foo: "/custom/reader.ts" },
    });
    const call = vi.mocked(loadMessages).mock.calls[0]?.[0];
    expect(call?.readers).toHaveProperty("foo");
  });

  it("skips server and client loaders when none are defined", async () => {
    const config = createConfig({ loader: false, client: undefined } as any);
    const result = await collectRuntimeMessages(config, "en", {});
    expect(result.messages).toEqual({ en: { static: true } });
    expect(result.overrides).toEqual([]);
    expect(loadMessages).not.toHaveBeenCalled();
  });
});
