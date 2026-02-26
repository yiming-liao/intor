// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, act } from "@testing-library/react";
import {
  IntorProvider,
  IntorContext,
} from "../../../../../src/client/react/provider/intor-provider";

vi.mock(
  "../../../../../src/client/react/provider/effects/use-locale-effects",
  () => ({ useLocaleEffects: vi.fn() }),
);

vi.mock(
  "../../../../../src/client/react/provider/effects/use-messages-effects",
  () => ({ useMessagesEffects: vi.fn() }),
);

vi.mock("intor-translator", async () => {
  return {
    Translator: vi.fn().mockImplementation(function (this: any, args) {
      this.__translatorArgs = args;
      this.messages = args.messages;
      this.locale = args.locale;
      this.isLoading = args.isLoading;
    }),
  };
});

describe("IntorProvider", () => {
  const baseConfig: any = {
    fallbackLocales: { en: ["fr"] },
    messages: { en: { base: true } },
    translator: {},
  };

  const renderWithProvider = (value: any) => {
    let contextValue: any;
    function Consumer() {
      contextValue = React.useContext(IntorContext);
      return null;
    }
    render(
      <IntorProvider value={value}>
        <Consumer />
      </IntorProvider>,
    );
    return () => contextValue;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("provides context value", () => {
    const getContext = renderWithProvider({
      config: baseConfig,
      locale: "en",
      messages: null,
    });
    const ctx = getContext();
    expect(ctx.locale).toBe("en");
    expect(ctx.config).toBe(baseConfig);
    expect(typeof ctx.setLocale).toBe("function");
  });

  it("updates locale via setLocale", () => {
    const getContext = renderWithProvider({
      config: baseConfig,
      locale: "en",
      messages: null,
    });
    const ctx = getContext();
    act(() => {
      ctx.setLocale("fr");
    });
    expect(getContext().locale).toBe("fr");
  });

  it("does not update locale if same value", () => {
    const getContext = renderWithProvider({
      config: baseConfig,
      locale: "en",
      messages: null,
    });
    const ctx = getContext();
    act(() => {
      ctx.setLocale("en");
    });
    expect(getContext().locale).toBe("en");
  });

  it("prioritizes runtimeMessages over messages over config", () => {
    const externalMessages = { en: { external: true } };
    const getContext = renderWithProvider({
      config: baseConfig,
      locale: "en",
      messages: externalMessages,
    });
    const ctx = getContext();
    expect(ctx.translator.messages).toEqual(externalMessages);
  });

  it("falls back to config.messages when no runtime or external messages", () => {
    const getContext = renderWithProvider({
      config: baseConfig,
      locale: "en",
      messages: null,
    });
    const ctx = getContext();
    expect(ctx.translator.messages).toEqual(baseConfig.messages);
  });

  it("external isLoading overrides internal", () => {
    const getContext = renderWithProvider({
      config: baseConfig,
      locale: "en",
      messages: null,
      isLoading: true,
    });
    const ctx = getContext();
    expect(ctx.translator.isLoading).toBe(true);
  });

  it("syncs internal locale when initialLocale prop changes", () => {
    let contextValue: any;
    function Consumer() {
      contextValue = React.useContext(IntorContext);
      return null;
    }
    const { rerender } = render(
      <IntorProvider
        value={{
          config: baseConfig,
          locale: "en",
          messages: null as any,
        }}
      >
        <Consumer />
      </IntorProvider>,
    );
    expect(contextValue.locale).toBe("en");
    rerender(
      <IntorProvider
        value={{
          config: baseConfig,
          locale: "fr",
          messages: null as any,
        }}
      >
        <Consumer />
      </IntorProvider>,
    );
    expect(contextValue.locale).toBe("fr");
  });

  it("passes correct arguments to Translator", () => {
    const getContext = renderWithProvider({
      config: baseConfig,
      locale: "en",
      messages: null,
    });
    const ctx = getContext();
    expect(ctx.translator.__translatorArgs).toMatchObject({
      messages: baseConfig.messages,
      locale: "en",
      fallbackLocales: baseConfig.fallbackLocales,
    });
  });

  it("calls side-effect hooks", async () => {
    const { useLocaleEffects } = await import(
      "../../../../../src/client/react/provider/effects/use-locale-effects"
    );
    const { useMessagesEffects } = await import(
      "../../../../../src/client/react/provider/effects/use-messages-effects"
    );
    renderWithProvider({
      config: baseConfig,
      locale: "en",
      messages: null,
    });
    expect(useLocaleEffects).toHaveBeenCalled();
    expect(useMessagesEffects).toHaveBeenCalled();
  });

  it("passes optional translator fields when defined", () => {
    const config = {
      ...baseConfig,
      translator: {
        loadingMessage: "loading...",
        missingMessage: "missing...",
      },
    };
    const handlers = {} as any;
    const plugins = {} as any;
    let ctx: any;
    function Consumer() {
      ctx = React.useContext(IntorContext);
      return null;
    }
    render(
      <IntorProvider
        value={{
          config,
          locale: "en",
          messages: null as any,
          handlers,
          plugins,
        }}
      >
        <Consumer />
      </IntorProvider>,
    );
    expect(ctx.translator.__translatorArgs).toMatchObject({
      loadingMessage: "loading...",
      missingMessage: "missing...",
      handlers,
      plugins,
    });
  });

  it("falls back to empty object when no messages anywhere", () => {
    let ctx: any;
    function Consumer() {
      ctx = React.useContext(IntorContext);
      return null;
    }
    render(
      <IntorProvider
        value={{
          config: {} as any,
          locale: "en",
          messages: null as any,
        }}
      >
        <Consumer />
      </IntorProvider>,
    );
    expect(ctx.translator.messages).toEqual({});
  });
});
