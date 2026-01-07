/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "@/config";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { IntorError, IntorErrorCode } from "@/core";
import { resolveLoaderOptions } from "@/core";
import { loadMessages } from "@/server/messages";
import { createIntorRuntime } from "@/server/runtime/create-intor-runtime";

vi.mock("@/server/messages", () => ({
  loadMessages: vi.fn(),
}));

vi.mock("@/core", async () => {
  const actual = await vi.importActual<any>("@/core");
  return {
    ...actual,
    resolveLoaderOptions: vi.fn(),
  };
});

function createConfig(): IntorResolvedConfig {
  return {
    id: "test-intor",
    supportedLocales: ["en", "zh"],
    defaultLocale: "en",
    fallbackLocales: {},
    cache: undefined,
    logger: undefined,
    translator: {},
  } as unknown as IntorResolvedConfig;
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("createIntorRuntime()", () => {
  it("throws if translator() is called before ensureMessages()", () => {
    const runtime = createIntorRuntime(createConfig());
    expect(() => {
      runtime.translator("en" as any);
    }).toThrowError(IntorError);
    try {
      runtime.translator("en" as any);
    } catch (error) {
      expect((error as IntorError).code).toBe(
        IntorErrorCode.RUNTIME_NOT_INITIALIZED,
      );
    }
  });

  it("throws when translator() locale does not match ensured locale", async () => {
    const runtime = createIntorRuntime(createConfig());
    await runtime.ensureMessages("en" as any);
    expect(() => {
      runtime.translator("zh" as any);
    }).toThrowError(IntorError);
  });

  it("allows empty messages after ensureMessages() without loader", async () => {
    vi.mocked(resolveLoaderOptions).mockReturnValue(undefined);
    const runtime = createIntorRuntime(createConfig());
    await runtime.ensureMessages("en" as any);
    const translator = runtime.translator("en" as any);
    expect(translator.locale).toBe("en");
    expect(typeof translator.t).toBe("function");
    expect(typeof translator.hasKey).toBe("function");
  });

  it("loads messages when loader is configured", async () => {
    vi.mocked(resolveLoaderOptions).mockReturnValue({
      type: "local",
      rootDir: "messages",
    } as any);
    vi.mocked(loadMessages).mockResolvedValueOnce({
      en: {
        common: {
          greeting: "Hello",
        },
      },
    });
    const runtime = createIntorRuntime(createConfig());
    await runtime.ensureMessages("en" as any);
    const translator = runtime.translator("en" as any);
    expect(loadMessages).toHaveBeenCalledTimes(1);
    expect(translator.t("common.greeting")).toBe("Hello");
  });

  it("still initializes runtime when loader returns undefined", async () => {
    vi.mocked(resolveLoaderOptions).mockReturnValue({
      type: "local",
    } as any);
    vi.mocked(loadMessages).mockResolvedValueOnce(undefined);
    const runtime = createIntorRuntime(createConfig());
    await runtime.ensureMessages("en" as any);
    const translator = runtime.translator("en" as any);
    expect(translator.locale).toBe("en");
    expect(translator.t).toBeDefined();
  });

  it("passes handlers and plugins to translator without crashing", async () => {
    vi.mocked(resolveLoaderOptions).mockReturnValue(undefined);
    const runtime = createIntorRuntime(createConfig());
    await runtime.ensureMessages("en" as any);
    expect(() =>
      runtime.translator("en" as any, {
        handlers: {
          formatHandler: vi.fn() as any,
        },
        plugins: [vi.fn() as any],
      }),
    ).not.toThrow();
  });
});
