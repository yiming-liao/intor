/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LocaleMessages } from "intor-translator";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { intor } from "@/server/intor/intor";
import { shouldLoadMessages } from "@/server/intor/utils/should-load-messages";
import { loadMessages } from "@/server/messages";
import { getLogger } from "@/server/shared/logger/get-logger";
import { mergeMessages } from "@/shared/utils";

vi.mock("@/server/shared/logger/get-logger");
vi.mock("@/server/intor/utils/should-load-messages");
vi.mock("@/server/messages");
vi.mock("@/shared/utils");

describe("intor", () => {
  let mockLogger: any;
  let mockChildLogger: any;

  beforeEach(() => {
    mockChildLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
    };
    mockLogger = {
      child: vi.fn().mockReturnValue(mockChildLogger),
    };
    vi.mocked(getLogger).mockReturnValue(mockLogger);
    vi.mocked(shouldLoadMessages).mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should resolve context from object and load messages", async () => {
    const config = {
      id: "test",
      defaultLocale: "en",
      messages: { static: "msg" },
      loader: { type: "remote" },
      logger: {},
    };
    const i18nContext = { locale: "fr", pathname: "/home" };
    const loadedMessages: LocaleMessages = { hello: "world" } as any;
    vi.mocked(loadMessages).mockResolvedValue(loadedMessages as any);
    vi.mocked(mergeMessages).mockImplementation((a, b) => ({
      ...a,
      ...b,
    }));

    const result = await intor(config as any, i18nContext as any);

    expect(result.initialLocale).toBe("fr");
    expect(result.pathname).toBe("/home");
    expect(result.messages).toEqual({ static: "msg", hello: "world" });
    expect(loadMessages).toHaveBeenCalledWith(
      expect.objectContaining({ config, locale: "fr", pathname: "/home" }),
    );
    expect(mockChildLogger.info).toHaveBeenCalledWith(
      "Start Intor initialization.",
    );
    expect(mockChildLogger.debug).toHaveBeenCalledWith(
      "I18n context resolved via static fallback.",
      {
        locale: "fr",
        pathname: "/home",
      },
    );
  });

  it("should resolve context from function and load messages", async () => {
    const config = {
      id: "test",
      defaultLocale: "en",
      messages: {},
      loader: { type: "remote" },
      logger: {},
    };
    const i18nContextFn = vi
      .fn()
      .mockResolvedValue({ locale: "de", pathname: "/dashboard" });
    const loadedMessages: LocaleMessages = { greet: "hi" } as any;
    vi.mocked(loadMessages).mockResolvedValue(loadedMessages as any);
    vi.mocked(mergeMessages).mockImplementation((a, b) => ({
      ...a,
      ...b,
    }));

    const result = await intor(config as any, i18nContextFn);

    expect(i18nContextFn).toHaveBeenCalledWith(config);
    expect(result.initialLocale).toBe("de");
    expect(result.pathname).toBe("/dashboard");
    expect(result.messages).toEqual({ greet: "hi" });
    expect(mockChildLogger.debug).toHaveBeenCalledWith(
      "I18n context resolved via Mock.",
      {
        locale: "de",
        pathname: "/dashboard",
      },
    );
  });

  it("should skip loadMessages if loader disabled", async () => {
    vi.mocked(shouldLoadMessages).mockReturnValue(false);
    const config = {
      id: "test",
      defaultLocale: "en",
      messages: { only: "static" },
      loader: null,
      logger: {},
    };
    const result = await intor(config as any, { locale: "en" as any });

    expect(loadMessages).not.toHaveBeenCalled();
    expect(result.messages).toEqual({ only: "static" });
  });

  it("should handle empty loaded messages", async () => {
    const config = {
      id: "test",
      defaultLocale: "en",
      messages: { a: 1 },
      loader: { type: "remote" },
      logger: {},
    };
    vi.mocked(loadMessages).mockResolvedValue({} as any);
    vi.mocked(mergeMessages).mockImplementation((a, b) => ({
      ...a,
      ...b,
    }));

    const result = await intor(config as any, { locale: "en" as any });

    expect(result.messages).toEqual({ a: 1 });
  });
});
