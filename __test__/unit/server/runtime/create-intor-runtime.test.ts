/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "@/config";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { IntorError, IntorErrorCode } from "@/core";
import { loadMessages } from "@/server/messages";
import { createIntorRuntime } from "@/server/runtime/create-intor-runtime";

vi.mock("@/server/messages", () => ({
  loadMessages: vi.fn(),
}));

function createConfig(): IntorResolvedConfig {
  return {
    supportedLocales: ["en", "zh"],
    defaultLocale: "en",
    fallbackLocales: {},
    messages: {
      en: {
        common: {
          fromConfig: "config-value",
        },
      },
    },
    cache: undefined,
    logger: undefined,
    translator: {},
  } as unknown as IntorResolvedConfig;
}

describe("createIntorRuntime()", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("throws if translator() is called before ensureMessages()", () => {
    const config = createConfig();
    const runtime = createIntorRuntime(config);
    try {
      runtime.translator("en" as any);
      throw new Error("Expected error was not thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(IntorError);
      expect((error as IntorError).code).toBe(
        IntorErrorCode.RUNTIME_NOT_INITIALIZED,
      );
    }
  });
  it("creates translator after ensureMessages()", async () => {
    const config = createConfig();
    vi.mocked(loadMessages).mockResolvedValueOnce({
      en: {
        common: {
          greeting: "Hello",
        },
      },
    });
    const runtime = createIntorRuntime(config);
    await runtime.ensureMessages("en" as any);
    const translator = runtime.translator("en" as any);
    expect(translator.locale).toBe("en" as any);
    expect(typeof translator.t).toBe("function");
    expect(typeof translator.hasKey).toBe("function");
  });

  it("throws when translator() locale does not match ensured locale", async () => {
    const config = createConfig();
    vi.mocked(loadMessages).mockResolvedValueOnce({
      en: {
        common: {
          greeting: "Hello",
        },
      },
    });
    const runtime = createIntorRuntime(config);
    await runtime.ensureMessages("en" as any);
    try {
      runtime.translator("zh" as any);
      throw new Error("Expected error was not thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(IntorError);
      expect((error as IntorError).code).toBe(
        IntorErrorCode.RUNTIME_NOT_INITIALIZED,
      );
    }
  });

  it("allows empty messages after ensureMessages()", async () => {
    const config = createConfig(); // Simulate loader returning nothing
    vi.mocked(loadMessages).mockResolvedValueOnce(undefined);
    const runtime = createIntorRuntime(config);
    await runtime.ensureMessages("en" as any);
    const translator = runtime.translator("en" as any); // Translator should still be usable
    expect(translator.locale).toBe("en" as any);
    expect(translator.t).toBeDefined();
    expect(translator.hasKey).toBeDefined();
  });

  it("passes handlers and plugins to translator without crashing", async () => {
    const config = createConfig();
    vi.mocked(loadMessages).mockResolvedValueOnce({
      en: {
        common: {
          greeting: "Hello",
        },
      },
    });
    const handler = vi.fn();
    const plugin = vi.fn();
    const runtime = createIntorRuntime(config);
    await runtime.ensureMessages("en" as any);
    expect(() =>
      runtime.translator("en" as any, {
        handlers: { formatHandler: handler as any },
        plugins: [plugin as any],
      }),
    ).not.toThrow();
  });
});
