// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";
import { get } from "svelte/store";
import {
  buildIntorStores,
  createIntorStore,
  INTOR_CONTEXT_KEY,
} from "../../../../../src/client/svelte/provider/create-intor-store";
import { attachLocaleEffects } from "../../../../../src/client/svelte/provider/effects/attach-locale-effects";
import { attachMessagesEffects } from "../../../../../src/client/svelte/provider/effects/attach-messages-effects";

vi.mock(
  "../../../../../src/client/svelte/provider/effects/attach-locale-effects",
  () => ({
    attachLocaleEffects: vi.fn(),
  }),
);

vi.mock(
  "../../../../../src/client/svelte/provider/effects/attach-messages-effects",
  () => ({
    attachMessagesEffects: vi.fn(),
  }),
);

vi.mock("svelte", async () => {
  const actual = await vi.importActual<any>("svelte");
  return {
    ...actual,
    setContext: vi.fn(),
  };
});

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

describe("Svelte Intor Store", () => {
  const baseConfig: any = {
    fallbackLocales: { en: ["fr"] },
    messages: { en: { base: true } },
    translator: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes locale correctly", () => {
    const stores = buildIntorStores({
      config: baseConfig,
      locale: "en",
    } as any);
    expect(get(stores.locale)).toBe("en");
  });

  it("setLocale does nothing if same", () => {
    const stores = buildIntorStores({
      config: baseConfig,
      locale: "en",
    } as any);
    stores.setLocale("en");
    expect(get(stores.locale)).toBe("en");
  });

  it("setLocale updates and calls onLocaleChange", () => {
    const onLocaleChange = vi.fn();
    const stores = buildIntorStores({
      config: baseConfig,
      locale: "en",
      onLocaleChange,
    } as any);
    stores.setLocale("fr");
    expect(get(stores.locale)).toBe("fr");
    expect(onLocaleChange).toHaveBeenCalledWith("fr");
  });

  it("messages priority: runtime > external > config", () => {
    const stores = buildIntorStores({
      config: baseConfig,
      locale: "en",
      messages: { en: { external: true } },
    } as any);
    let translator: any;
    stores.translator.subscribe((t) => (translator = t))();
    expect(translator.messages).toEqual({ en: { external: true } });
    stores.runtimeMessages.set({ en: { runtime: true } });
    stores.translator.subscribe((t) => (translator = t))();
    expect(translator.messages).toEqual({ en: { runtime: true } });
  });

  it("loading merges external and internal", () => {
    const stores = buildIntorStores({
      config: baseConfig,
      locale: "en",
      isLoading: true,
    } as any);
    let translator: any;
    stores.translator.subscribe((t) => (translator = t))();
    expect(translator.isLoading).toBe(true);
    const stores2 = buildIntorStores({
      config: baseConfig,
      locale: "en",
      isLoading: false,
    } as any);
    stores2.internalIsLoading.set(true);
    stores2.translator.subscribe((t) => (translator = t))();
    expect(translator.isLoading).toBe(true);
  });

  it("passes optional translator fields", () => {
    const stores = buildIntorStores({
      config: {
        ...baseConfig,
        translator: {
          loadingMessage: "Loading...",
          missingMessage: "Missing",
        },
      },
      locale: "en",
      handlers: { test: true },
      hooks: [{ name: "hook" }],
    } as any);
    let translator: any;
    stores.translator.subscribe((t) => (translator = t))();
    expect(translator.__translatorArgs.loadingMessage).toBe("Loading...");
    expect(translator.__translatorArgs.missingMessage).toBe("Missing");
    expect(translator.__translatorArgs.handlers).toEqual({ test: true });
    expect(translator.__translatorArgs.hooks).toEqual([{ name: "hook" }]);
  });

  it("calls side effects and setContext", async () => {
    const { setContext } = await import("svelte");
    createIntorStore({
      config: baseConfig,
      locale: "en",
    } as any);
    expect(attachLocaleEffects).toHaveBeenCalledTimes(1);
    expect(attachMessagesEffects).toHaveBeenCalledTimes(1);
    expect(setContext).toHaveBeenCalledWith(
      INTOR_CONTEXT_KEY,
      expect.objectContaining({
        config: baseConfig,
        locale: expect.any(Object),
        setLocale: expect.any(Function),
        translator: expect.any(Object),
      }),
    );
  });

  it("uses external isLoading store branch", () => {
    const externalStore = {
      subscribe: (fn: any) => {
        fn(true);
        return () => {};
      },
    };
    const stores = buildIntorStores({
      config: baseConfig,
      locale: "en",
      isLoading: externalStore,
    } as any);
    let translator: any;
    stores.translator.subscribe((t) => (translator = t))();
    expect(translator.isLoading).toBe(true);
  });

  it("handles undefined translator config", () => {
    const stores = buildIntorStores({
      config: {
        fallbackLocales: { en: ["fr"] },
        messages: { en: { base: true } },
      },
      locale: "en",
    } as any);
    let translator: any;
    stores.translator.subscribe((t) => (translator = t))();
    expect(translator.__translatorArgs.loadingMessage).toBeUndefined();
    expect(translator.__translatorArgs.missingMessage).toBeUndefined();
  });
});
