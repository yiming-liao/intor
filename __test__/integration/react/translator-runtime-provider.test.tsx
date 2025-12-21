import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type {
  FormatHandler,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { IntorProvider, TranslatorRuntimeProvider } from "@/client/react";
import { useTranslatorRuntime } from "@/client/react/contexts/translator-runtime";
import {
  DEFAULT_CACHE_OPTIONS,
  DEFAULT_COOKIE_OPTIONS,
  DEFAULT_ROUTING_OPTIONS,
} from "@/config";

const mockConfig: IntorResolvedConfig = {
  id: "test-intor",
  defaultLocale: "en-US",
  supportedLocales: ["en-US", "zh-TW"],
  fallbackLocales: {},
  cache: DEFAULT_CACHE_OPTIONS,
  cookie: DEFAULT_COOKIE_OPTIONS,
  routing: DEFAULT_ROUTING_OPTIONS,
};

const mockFormatHandler: FormatHandler = () => {};
const mockTranslatorPlugin: TranslatorPlugin = {};

describe("TranslatorRuntimeProvider (integration)", () => {
  it("provides handlers and plugins to consumers", () => {
    let receivedHandlers: TranslateHandlers | undefined;
    let receivedPlugins: (TranslatorPlugin | TranslateHook)[] | undefined;

    function Consumer() {
      const runtime = useTranslatorRuntime();
      receivedHandlers = runtime?.handlers;
      receivedPlugins = runtime?.plugins;
      return null;
    }

    render(
      <TranslatorRuntimeProvider
        value={{
          handlers: { formatHandler: mockFormatHandler },
          plugins: [mockTranslatorPlugin],
        }}
      >
        <IntorProvider value={{ config: mockConfig, initialLocale: "en-US" }}>
          <Consumer />
        </IntorProvider>
        ,
      </TranslatorRuntimeProvider>,
    );

    expect(receivedHandlers).toBeDefined();
    expect(receivedPlugins).toBeDefined();
    expect(receivedHandlers?.formatHandler).toBe(mockFormatHandler);
    expect(receivedPlugins?.[0]).toBe(mockTranslatorPlugin);
  });
});
