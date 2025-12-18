/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { intor } from "@/server/intor/intor";
import { loadMessages } from "@/server/messages";
import { getLogger } from "@/server/shared/logger/get-logger";
import { deepMerge } from "@/shared/utils";

vi.mock("@/server/shared/logger/get-logger");
vi.mock("@/server/messages");
vi.mock("@/shared/utils", () => ({
  deepMerge: vi.fn(),
}));

describe("intor", () => {
  let loggerMock: any;
  let childLoggerMock: any;

  beforeEach(() => {
    childLoggerMock = {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
    };
    loggerMock = {
      child: vi.fn().mockReturnValue(childLoggerMock),
    };
    vi.mocked(getLogger).mockReturnValue(loggerMock);
    vi.clearAllMocks();
  });

  it("resolves context from static object and loads messages", async () => {
    const config = {
      id: "test",
      defaultLocale: "en-US",
      messages: { static: "msg" },
      loader: { type: "local" },
      logger: {},
    } as any;
    const i18nContext = { locale: "fr-FR", pathname: "/home" } as any;
    const loadedMessages = { hello: "world" } as any;
    vi.mocked(loadMessages).mockResolvedValue(loadedMessages);
    vi.mocked(deepMerge).mockReturnValue({
      static: "msg",
      hello: "world",
    });
    const result = await intor(config, i18nContext);
    expect(result.initialLocale).toBe("fr-FR");
    expect(result.pathname).toBe("/home");
    expect(result.messages).toEqual({
      static: "msg",
      hello: "world",
    });
    expect(loadMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        config,
        locale: "fr-FR",
        pathname: "/home",
        allowCacheWrite: true,
      }),
    );
    expect(childLoggerMock.info).toHaveBeenCalledWith(
      "Start Intor initialization.",
    );
    expect(childLoggerMock.debug).toHaveBeenCalledWith(
      'I18n context resolved via "static context".',
      { locale: "fr-FR", pathname: "/home" },
    );
    expect(childLoggerMock.info).toHaveBeenCalledWith("Intor initialized.");
  });

  it("resolves context from resolver function", async () => {
    const config = {
      id: "test",
      defaultLocale: "en-US",
      messages: {},
      loader: { type: "local" },
      logger: {},
    } as any;
    const resolver = vi
      .fn()
      .mockResolvedValue({ locale: "de-DE", pathname: "/dashboard" });
    vi.mocked(loadMessages).mockResolvedValue({ greet: "hi" } as any);
    vi.mocked(deepMerge).mockReturnValue({ greet: "hi" });
    const result = await intor(config, resolver);
    expect(resolver).toHaveBeenCalledWith(config);
    expect(result.initialLocale).toBe("de-DE");
    expect(result.pathname).toBe("/dashboard");
    expect(childLoggerMock.debug).toHaveBeenCalledWith(
      `I18n context resolved via "${resolver.name}".`,
      { locale: "de-DE", pathname: "/dashboard" },
    );
  });

  it("skips loadMessages when loader is not configured", async () => {
    const config = {
      id: "test",
      defaultLocale: "en-US",
      messages: { a: 1 },
      logger: {},
    } as any;
    vi.mocked(deepMerge).mockReturnValue({ a: 1 });
    const result = await intor(config, { locale: "en-US" });
    expect(loadMessages).not.toHaveBeenCalled();
    expect(result.messages).toEqual({ a: 1 });
  });

  it("returns empty messages object when deepMerge returns undefined", async () => {
    const config = {
      id: "test",
      defaultLocale: "en-US",
      messages: {},
      loader: { type: "local" },
      logger: {},
    } as any;
    vi.mocked(loadMessages).mockResolvedValue(undefined);
    vi.mocked(deepMerge).mockReturnValue(undefined);
    const result = await intor(config, { locale: "en-US" });
    expect(result.messages).toEqual({});
  });
});
