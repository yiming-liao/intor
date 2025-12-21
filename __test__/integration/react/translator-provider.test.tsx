import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ConfigProvider } from "@/client/react/contexts/config";
import { LocaleProvider } from "@/client/react/contexts/locale";
import { MessagesProvider } from "@/client/react/contexts/messages";
import {
  TranslatorProvider,
  useTranslator,
} from "@/client/react/contexts/translator";
import {
  DEFAULT_CACHE_OPTIONS,
  DEFAULT_COOKIE_OPTIONS,
  DEFAULT_ROUTING_OPTIONS,
} from "@/config";

const mockMessages = {
  "en-US": { hello: "World" },
  "zh-TW": { hello: "世界" },
};

const mockConfig: IntorResolvedConfig = {
  id: "test-intor",
  defaultLocale: "en-US",
  supportedLocales: ["en-US", "zh-TW"],
  fallbackLocales: {},
  messages: mockMessages,
  cache: DEFAULT_CACHE_OPTIONS,
  cookie: DEFAULT_COOKIE_OPTIONS,
  routing: DEFAULT_ROUTING_OPTIONS,
};

describe("TranslatorProvider (integration)", () => {
  it("provides a working translator instance", () => {
    let translate: string | undefined;
    let hasKey: boolean | undefined;
    let locale: string | undefined;
    let isLoading: boolean | undefined;
    function Consumer() {
      const { translator } = useTranslator();
      translate = translator.t("hello");
      hasKey = translator.hasKey("hello");
      locale = translator.locale;
      isLoading = translator.isLoading;
      return null;
    }

    render(
      <ConfigProvider value={{ config: mockConfig }}>
        <LocaleProvider value={{ initialLocale: "en-US" }}>
          <MessagesProvider value={{ messages: mockConfig.messages }}>
            <TranslatorProvider>
              <Consumer />
            </TranslatorProvider>
          </MessagesProvider>
        </LocaleProvider>
      </ConfigProvider>,
    );

    expect(translate).toBe("World");
    expect(hasKey).toBe(true);
    expect(locale).toBe("en-US");
    expect(isLoading).toBe(false);
  });
});
