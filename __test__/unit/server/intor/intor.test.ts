/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LocaleMessages } from "intor-translator";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { intor } from "@/server/intor/intor";
import * as loadMessagesModule from "@/server/messages/load-messages";
import * as loggerModule from "@/shared/logger";
import * as loaderResolver from "@/shared/utils/resolve-loader-options";

const loggerChildMock = {
  info: vi.fn(),
  debug: vi.fn(),
};

const loggerMock = {
  child: vi.fn().mockReturnValue(loggerChildMock),
};

vi.spyOn(loggerModule, "getLogger").mockReturnValue(loggerMock as any);
vi.spyOn(loaderResolver, "resolveLoaderOptions");
vi.spyOn(loadMessagesModule, "loadMessages");

function createConfig(overrides: Partial<any> = {}) {
  return {
    id: "test",
    defaultLocale: "en-US",
    supportedLocales: ["en-US", "zh-TW"],
    fallbackLocales: { "en-US": ["zh-TW"] },
    messages: { "en-US": { static: "value" } },
    logger: { id: "test" },
    cache: { enabled: false, ttl: 0 },
    cookie: {} as any,
    routing: {} as any,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("intor", () => {
  it("resolves locale from static value", async () => {
    vi.mocked(loaderResolver.resolveLoaderOptions).mockReturnValue(undefined);

    const config = createConfig();

    const result = await intor(config, "zh-TW");

    expect(result.initialLocale).toBe("zh-TW");
    expect(loadMessagesModule.loadMessages).not.toHaveBeenCalled();
    expect(result.initialMessages).toEqual(config.messages);
  });

  it("resolves locale using resolver function", async () => {
    vi.mocked(loaderResolver.resolveLoaderOptions).mockReturnValue(undefined);

    const config = createConfig();

    const localeResolver = vi.fn().mockResolvedValue("zh-TW");

    const result = await intor(config, localeResolver);

    expect(localeResolver).toHaveBeenCalledWith(config);
    expect(result.initialLocale).toBe("zh-TW");
  });

  it("loads messages when a loader is configured", async () => {
    const loadedMessages: LocaleMessages = {
      "en-US": { remote: "value" },
    };

    vi.mocked(loaderResolver.resolveLoaderOptions).mockReturnValue({
      type: "remote",
      url: "https://api.example.com",
    } as any);

    vi.mocked(loadMessagesModule.loadMessages).mockResolvedValue(
      loadedMessages,
    );

    const config = createConfig();

    const result = await intor(config, "en-US");

    expect(loadMessagesModule.loadMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        config,
        locale: "en-US",
        allowCacheWrite: true,
      }),
    );

    expect(result.initialMessages).toEqual({
      "en-US": {
        static: "value",
        remote: "value",
      },
    });
  });

  it("passes extraOptions to loadMessages", async () => {
    vi.mocked(loaderResolver.resolveLoaderOptions).mockReturnValue({
      type: "local",
    } as any);

    vi.mocked(loadMessagesModule.loadMessages).mockResolvedValue(undefined);

    const config = createConfig();

    await intor(config, "en-US", {
      exts: [".json"],
      messagesReader: vi.fn(),
    });

    expect(loadMessagesModule.loadMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        extraOptions: {
          exts: [".json"],
          messagesReader: expect.any(Function),
        },
      }),
    );
  });

  it("merges static messages with loaded messages", async () => {
    vi.mocked(loaderResolver.resolveLoaderOptions).mockReturnValue({
      type: "remote",
    } as any);

    vi.mocked(loadMessagesModule.loadMessages).mockResolvedValue({
      "en-US": { dynamic: "yes" },
    });

    const config = createConfig({
      messages: {
        "en-US": { static: "value" },
      },
    });

    const result = await intor(config, "en-US");

    expect(result.initialMessages).toEqual({
      "en-US": {
        static: "value",
        dynamic: "yes",
      },
    });
  });

  it("logs lifecycle messages", async () => {
    vi.mocked(loaderResolver.resolveLoaderOptions).mockReturnValue(undefined);

    const config = createConfig();

    await intor(config, "en-US");

    expect(loggerChildMock.info).toHaveBeenCalledWith(
      "Start Intor initialization.",
    );
    expect(loggerChildMock.info).toHaveBeenCalledWith("Intor initialized.");
  });
});
