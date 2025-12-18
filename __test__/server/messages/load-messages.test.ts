/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LoadMessagesOptions } from "@/server/messages/types";
import type { LocaleMessages } from "intor-translator";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as localModule from "@/server/messages/load-local-messages";
import { loadMessages } from "@/server/messages/load-messages";
import * as remoteModule from "@/server/messages/load-remote-messages";
import * as loggerModule from "@/server/shared/logger/get-logger";
import * as utilsModule from "@/shared/utils";

vi.mock("@/server/messages/load-local-messages");
vi.mock("@/server/messages/load-remote-messages");
vi.mock("@/server/shared/logger/get-logger");
vi.mock("@/shared/utils");

describe("loadMessages", () => {
  const mockLocalMessages: LocaleMessages = { "en-US": { hello: "Local" } };
  const mockRemoteMessages: LocaleMessages = { "en-US": { hello: "Remote" } };

  let loggerChildMock: any;
  let loggerMock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock logger
    loggerChildMock = {
      core: { level: "debug" },
      warn: vi.fn(),
      info: vi.fn(),
      debug: vi.fn(),
      trace: vi.fn(),
    };
    loggerMock = vi.fn().mockReturnValue({
      child: vi.fn().mockReturnValue(loggerChildMock),
    });
    vi.spyOn(loggerModule, "getLogger").mockImplementation(loggerMock);

    // Mock resolveNamespaces
    vi.spyOn(utilsModule, "resolveNamespaces").mockImplementation(
      ({ config }) => config.loader?.namespaces ?? ["default"],
    );
  });

  it("uses local loader when type is 'local'", async () => {
    vi.mocked(localModule.loadLocalMessages).mockResolvedValue(
      mockLocalMessages,
    );

    const config = {
      id: "test",
      loader: { type: "local", rootDir: "/root", concurrency: 5 },
      cache: { enabled: false },
      fallbackLocales: {},
    };

    const result = await loadMessages({
      config,
      locale: "en-US",
    } as LoadMessagesOptions);

    expect(result).toEqual(mockLocalMessages);
    expect(localModule.loadLocalMessages).toHaveBeenCalled();
    expect(remoteModule.loadRemoteMessages).not.toHaveBeenCalled();
  });

  it("uses remote loader when type is 'remote'", async () => {
    vi.mocked(remoteModule.loadRemoteMessages).mockResolvedValue(
      mockRemoteMessages,
    );

    const config = {
      id: "test",
      loader: { type: "remote", remoteUrl: "https://api.test/messages" },
      cache: { enabled: false },
      fallbackLocales: {},
    };

    const result = await loadMessages({
      config,
      locale: "en-US",
    } as LoadMessagesOptions);

    expect(result).toEqual(mockRemoteMessages);
    expect(remoteModule.loadRemoteMessages).toHaveBeenCalled();
    expect(localModule.loadLocalMessages).not.toHaveBeenCalled();
  });

  it("logs warning and returns undefined if no loader is configured", async () => {
    const config = { id: "test", fallbackLocales: {}, cache: {} };
    const result = await loadMessages({ config, locale: "en-US" } as any);

    expect(result).toBeUndefined();
    expect(loggerChildMock.warn).toHaveBeenCalledWith(
      "No loader options have been configured in the current config.",
    );
  });

  it("applies fallback locales", async () => {
    vi.mocked(localModule.loadLocalMessages).mockResolvedValue(
      mockLocalMessages,
    );

    const config = {
      id: "test",
      loader: { type: "local", rootDir: "/root" },
      cache: { enabled: false },
      fallbackLocales: { "fr-FR": ["en-US"] },
    };

    const result = await loadMessages({
      config,
      locale: "fr-FR",
    } as any);

    expect(result).toEqual(mockLocalMessages);
    expect(localModule.loadLocalMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        fallbackLocales: ["en-US"],
      }),
    );
  });

  it("logs warning if no messages are loaded", async () => {
    vi.mocked(localModule.loadLocalMessages).mockResolvedValue({});

    const config = {
      id: "test",
      loader: { type: "local", rootDir: "/root" },
      cache: { enabled: false },
      fallbackLocales: {},
    };

    const result = await loadMessages({
      config,
      locale: "en-US",
    } as LoadMessagesOptions);

    expect(result).toEqual({});
    expect(loggerChildMock.warn).toHaveBeenCalledWith("No messages found.", {
      locale: "en-US",
      fallbackLocales: [],
    });
  });
});
