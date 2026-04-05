/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "intor";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { collectMessages } from "../../../../src/core/collect-messages/collect-messages";
import { collectNonDefaultLocaleMessages } from "../../../../src/core/collect-messages/collect-non-default-locale-messages";

vi.mock("../../../../src/core/collect-messages/collect-messages", () => ({
  collectMessages: vi.fn(),
}));

const createConfig = (
  overrides: Partial<IntorResolvedConfig> = {},
): IntorResolvedConfig =>
  ({
    id: "app",
    defaultLocale: "en",
    supportedLocales: ["en", "zh", "ja"],
    messages: { en: { hello: "Hello" } },
    ...overrides,
  }) as IntorResolvedConfig;

describe("collectNonDefaultLocaleMessages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("collects only non-default locales", async () => {
    const config = createConfig();
    vi.mocked(collectMessages)
      .mockResolvedValueOnce({
        messages: { zh: { hello: "你好" } },
        overrides: [],
      } as any)
      .mockResolvedValueOnce({
        messages: { ja: { hello: "こんにちは" } },
        overrides: [],
      } as any);
    const result = await collectNonDefaultLocaleMessages(config, {});
    expect(collectMessages).toHaveBeenCalledTimes(2);
    expect(collectMessages).toHaveBeenNthCalledWith(1, "zh", config, {});
    expect(collectMessages).toHaveBeenNthCalledWith(2, "ja", config, {});
    expect(result).toEqual({
      zh: { hello: "你好" },
      ja: { hello: "こんにちは" },
    });
  });

  it("returns empty object when only default locale exists", async () => {
    const config = createConfig({
      supportedLocales: ["en"],
    });
    const result = await collectNonDefaultLocaleMessages(config, {});
    expect(collectMessages).not.toHaveBeenCalled();
    expect(result).toEqual({});
  });

  it("skips locale when collected messages do not contain that locale key", async () => {
    const config = createConfig({
      supportedLocales: ["en", "zh"],
    });
    vi.mocked(collectMessages).mockResolvedValueOnce({
      messages: {},
      overrides: [],
    } as any);
    const result = await collectNonDefaultLocaleMessages(config, {});
    expect(collectMessages).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  it("forwards reader options to collectMessages", async () => {
    const config = createConfig({ supportedLocales: ["en", "zh"] });
    const readerOptions = {
      exts: ["md"] as any,
      customReaders: { foo: "./foo-reader.ts" },
    };
    vi.mocked(collectMessages).mockResolvedValueOnce({
      messages: { zh: { title: "標題" } },
      overrides: [],
    } as any);
    await collectNonDefaultLocaleMessages(config, readerOptions);
    expect(collectMessages).toHaveBeenCalledWith("zh", config, readerOptions);
  });
});
