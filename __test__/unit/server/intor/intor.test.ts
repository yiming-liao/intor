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
    vi.mocked(getLogger).mockReturnValue(loggerMock as any);
    vi.clearAllMocks();
  });

  it("resolves initial locale from static getLocale value and loads messages", async () => {
    const config = {
      id: "test",
      defaultLocale: "en-US",
      messages: { static: "msg" },
      loader: { type: "local" },
      logger: {},
    } as any;
    const getLocale = "fr-FR";
    const loadedMessages = { hello: "world" } as any;
    vi.mocked(loadMessages).mockResolvedValue(loadedMessages);
    vi.mocked(deepMerge).mockReturnValue({
      static: "msg",
      hello: "world",
    });
    const result = await intor(config, getLocale as any);
    expect(result.initialLocale).toBe("fr-FR");
    expect(result.messages).toEqual({
      static: "msg",
      hello: "world",
    });
    expect(loadMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        config,
        locale: "fr-FR",
        allowCacheWrite: true,
      }),
    );
    expect(childLoggerMock.info).toHaveBeenCalledWith(
      "Start Intor initialization.",
    );
    expect(childLoggerMock.debug).toHaveBeenCalledWith(
      `Initial locale resolved as "fr-FR" via "static".`,
    );
    expect(childLoggerMock.info).toHaveBeenCalledWith("Intor initialized.");
  });

  it("resolves initial locale from async getLocale function", async () => {
    const config = {
      id: "test",
      defaultLocale: "en-US",
      messages: {},
      loader: { type: "local" },
      logger: {},
    } as any;
    const getLocale = vi.fn().mockResolvedValue("de-DE");
    vi.mocked(loadMessages).mockResolvedValue({ greet: "hi" } as any);
    vi.mocked(deepMerge).mockReturnValue({ greet: "hi" });
    const result = await intor(config, getLocale);
    expect(getLocale).toHaveBeenCalledWith(config);
    expect(result.initialLocale).toBe("de-DE");
    expect(childLoggerMock.debug).toHaveBeenCalledWith(
      `Initial locale resolved as "de-DE" via "resolver".`,
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
    const result = await intor(config, "en-US" as any);
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
    const result = await intor(config, "en-US" as any);
    expect(result.messages).toEqual({});
  });

  it("falls back to defaultLocale when getLocale is not provided", async () => {
    const config = {
      id: "test",
      defaultLocale: "en-US",
      messages: {},
      logger: {},
    } as any;
    vi.mocked(deepMerge).mockReturnValue({});
    const result = await intor(config, undefined as any);
    expect(result.initialLocale).toBe("en-US");
  });
});
