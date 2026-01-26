import type { IntorResolvedConfig } from "@/config";
import type { TranslateHandlers, TranslateHook } from "intor-translator";
import { describe, it, expect } from "vitest";
import { createTranslator } from "@/server/translator/create-translator";

describe("createTranslator()", () => {
  it("merges locale-scoped config messages with locale-scoped runtime messages", () => {
    const config: IntorResolvedConfig = {
      messages: {
        en: {
          common: {
            fromConfig: "config-value",
          },
        },
      },
      fallbackLocales: {},
      translator: {},
    } as unknown as IntorResolvedConfig;
    const { messages } = createTranslator({
      config,
      locale: "en",
      messages: {
        en: {
          common: {
            fromRuntime: "runtime-value",
          },
        },
      },
    });
    expect(messages).toEqual({
      en: {
        common: {
          fromConfig: "config-value",
          fromRuntime: "runtime-value",
        },
      },
    });
  });

  it("falls back to config locale messages when runtime locale messages are missing", () => {
    const config: IntorResolvedConfig = {
      messages: {
        en: {
          common: {
            greeting: "Hello",
          },
        },
      },
      fallbackLocales: {},
      translator: {},
    } as unknown as IntorResolvedConfig;
    const { t } = createTranslator({
      config,
      locale: "en",
      messages: {}, // runtime has no locale data
    });
    expect(t("common.greeting")).toBe("Hello");
  });

  it("passes handlers and plugins without affecting translation behavior", () => {
    const config: IntorResolvedConfig = {
      messages: {
        en: {
          common: {
            greeting: "Hello",
          },
        },
      },
      fallbackLocales: {},
      translator: {},
    } as unknown as IntorResolvedConfig;
    const handlers: TranslateHandlers = {
      formatHandler: (ctx) => ctx.formattedMessage!,
    };
    const plugin: TranslateHook = { name: "test", run: () => {} };
    const { t } = createTranslator({
      config,
      locale: "en",
      messages: {
        en: {
          common: {
            greeting: "Hello",
          },
        },
      },
      handlers,
      plugins: [plugin],
    });
    expect(t("common.greeting")).toBe("Hello");
  });
});
