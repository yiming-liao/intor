/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LocaleMessages } from "intor-translator";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as localModule from "@/server/messages/load-local-messages";
import { loadMessages } from "@/server/messages/load-messages";
import * as loggerModule from "@/shared/logger";
import * as remoteModule from "@/shared/messages";
import * as resolverModule from "@/shared/utils/resolve-loader-options";

const loggerChildMock = {
  info: vi.fn(),
  trace: vi.fn(),
  warn: vi.fn(),
};

const loggerMock = {
  child: vi.fn().mockReturnValue(loggerChildMock),
};

vi.spyOn(loggerModule, "getLogger").mockReturnValue(loggerMock as any);

vi.spyOn(localModule, "loadLocalMessages");
vi.spyOn(remoteModule, "loadRemoteMessages");
vi.spyOn(resolverModule, "resolveLoaderOptions");

function createConfig(overrides: Partial<any> = {}) {
  return {
    id: "test",
    logger: { id: "test" },
    cache: { enabled: false, ttl: 0 },
    fallbackLocales: { "en-US": ["zh-TW"] },
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("loadMessages", () => {
  it("returns early and warns when no loader is configured", async () => {
    vi.mocked(resolverModule.resolveLoaderOptions).mockReturnValue(undefined);

    const result = await loadMessages({
      config: createConfig() as any,
      locale: "en-US",
    });

    expect(result).toBeUndefined();
    expect(loggerChildMock.warn).toHaveBeenCalledWith(
      "No loader options have been configured in the current config.",
    );
    expect(localModule.loadLocalMessages).not.toHaveBeenCalled();
    expect(remoteModule.loadRemoteMessages).not.toHaveBeenCalled();
  });

  it("delegates to local loader when loader type is local", async () => {
    const messages: LocaleMessages = {
      "en-US": { hello: "local" },
    };

    vi.mocked(resolverModule.resolveLoaderOptions).mockReturnValue({
      type: "local",
      rootDir: "messages",
      namespaces: ["common"],
      concurrency: 5,
    } as any);

    vi.mocked(localModule.loadLocalMessages).mockResolvedValue(messages);

    const result = await loadMessages({
      config: createConfig() as any,
      locale: "en-US",
      extraOptions: { exts: [".json"] },
      allowCacheWrite: true,
    });

    expect(localModule.loadLocalMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "en-US",
        fallbackLocales: ["zh-TW"],
        namespaces: ["common"],
        rootDir: "messages",
        concurrency: 5,
        cacheOptions: { enabled: false, ttl: 0 },
        allowCacheWrite: true,
      }),
    );
    expect(remoteModule.loadRemoteMessages).not.toHaveBeenCalled();
    expect(result).toEqual(messages);
  });

  it("delegates to remote loader when loader type is remote", async () => {
    const messages: LocaleMessages = {
      "en-US": { hello: "remote" },
    };

    vi.mocked(resolverModule.resolveLoaderOptions).mockReturnValue({
      type: "remote",
      url: "https://api.example.com",
      namespaces: ["common"],
      rootDir: "messages",
      headers: { Authorization: "Bearer token" },
    } as any);

    vi.mocked(remoteModule.loadRemoteMessages).mockResolvedValue(messages);

    const result = await loadMessages({
      config: createConfig() as any,
      locale: "en-US",
      allowCacheWrite: false,
    });

    expect(remoteModule.loadRemoteMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "en-US",
        fallbackLocales: ["zh-TW"],
        namespaces: ["common"],
        rootDir: "messages",
        url: "https://api.example.com",
        headers: { Authorization: "Bearer token" },
        cacheOptions: { enabled: false, ttl: 0 },
        allowCacheWrite: false,
      }),
    );
    expect(localModule.loadLocalMessages).not.toHaveBeenCalled();
    expect(result).toEqual(messages);
  });

  it("warns when no messages are found", async () => {
    vi.mocked(resolverModule.resolveLoaderOptions).mockReturnValue({
      type: "remote",
      url: "https://api.example.com",
    } as any);

    vi.mocked(remoteModule.loadRemoteMessages).mockResolvedValue(undefined);

    const result = await loadMessages({
      config: createConfig() as any,
      locale: "en-US",
    });

    expect(result).toBeUndefined();
    expect(loggerChildMock.warn).toHaveBeenCalledWith(
      "No messages found.",
      expect.objectContaining({
        locale: "en-US",
        fallbackLocales: ["zh-TW"],
      }),
    );
  });
});
