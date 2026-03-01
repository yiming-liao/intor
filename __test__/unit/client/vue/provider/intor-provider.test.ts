// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, inject, nextTick } from "vue";
import {
  IntorProvider,
  IntorContextKey,
} from "../../../../../src/client/vue/provider/intor-provider";
import { Translator } from "intor-translator";

vi.mock(
  "../../../../../src/client/vue/provider/effects/use-locale-effects",
  () => ({ useLocaleEffects: vi.fn() }),
);

vi.mock(
  "../../../../../src/client/vue/provider/effects/use-messages-effects",
  () => ({ useMessagesEffects: vi.fn() }),
);

vi.mock("intor-translator", () => ({
  Translator: vi.fn().mockImplementation(function (this: any, args) {
    this.args = args;
    this.messages = args.messages;
    this.locale = args.locale;
    this.isLoading = args.isLoading;
  }),
}));

describe("IntorProvider (vue) — full coverage", () => {
  const baseConfig: any = {
    fallbackLocales: { en: ["fr"] },
    messages: { en: { base: true } },
    translator: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function mountProvider(value: any) {
    let exposed: any;
    const Consumer = defineComponent({
      setup() {
        exposed = inject(IntorContextKey);
        return () => null;
      },
    });
    const wrapper = mount({
      components: { IntorProvider, Consumer },
      template: `
        <IntorProvider :value="value">
          <Consumer />
        </IntorProvider>
      `,
      setup() {
        return { value };
      },
    });
    return { wrapper, getCtx: () => exposed.value };
  }

  it("setLocale does nothing if same locale", () => {
    const onLocaleChange = vi.fn();
    const { getCtx } = mountProvider({
      config: baseConfig,
      locale: "en",
      onLocaleChange,
    });
    const ctx = getCtx();
    ctx.setLocale("en");
    expect(onLocaleChange).not.toHaveBeenCalled();
    expect(ctx.locale.value).toBe("en");
  });

  it("setLocale updates when different", () => {
    const onLocaleChange = vi.fn();
    const { getCtx } = mountProvider({
      config: baseConfig,
      locale: "en",
      onLocaleChange,
    });
    const ctx = getCtx();
    ctx.setLocale("fr");
    expect(ctx.locale.value).toBe("fr");
    expect(onLocaleChange).toHaveBeenCalledWith("fr");
  });

  it("effectiveIsLoading uses external true", () => {
    const { getCtx } = mountProvider({
      config: baseConfig,
      locale: "en",
      isLoading: { value: true },
    });
    const ctx = getCtx();
    ctx.translator.value;
    expect(ctx.translator.value.isLoading).toBe(true);
  });

  it("effectiveIsLoading uses internal true", async () => {
    const { getCtx } = mountProvider({
      config: baseConfig,
      locale: "en",
    });
    const ctx = getCtx();
    ctx.translator.value;
    expect(ctx.translator.value.isLoading).toBe(false);
  });

  it("runtimeMessages highest priority", async () => {
    const { getCtx } = mountProvider({
      config: baseConfig,
      locale: "en",
    });
    const ctx = getCtx();
    ctx.translator.value;
    expect(ctx.translator.value.messages).toEqual(baseConfig.messages);
  });

  it("external messages priority", () => {
    const { getCtx } = mountProvider({
      config: baseConfig,
      locale: "en",
      messages: { value: { en: { external: true } } },
    });
    const ctx = getCtx();
    ctx.translator.value;
    expect(ctx.translator.value.messages).toEqual({
      en: { external: true },
    });
  });

  it("config fallback branch", () => {
    const { getCtx } = mountProvider({
      config: baseConfig,
      locale: "en",
      messages: undefined,
    });
    const ctx = getCtx();
    ctx.translator.value;
    expect(ctx.translator.value.messages).toEqual(baseConfig.messages);
  });

  it("empty object fallback branch", () => {
    const { getCtx } = mountProvider({
      config: { ...baseConfig, messages: undefined },
      locale: "en",
      messages: undefined,
    });
    const ctx = getCtx();
    ctx.translator.value;
    expect(ctx.translator.value.messages).toEqual({});
  });

  it("syncs locale when prop changes", async () => {
    const value = {
      config: baseConfig,
      locale: "en",
    };
    const { wrapper, getCtx } = mountProvider(value);
    await wrapper.setProps({
      value: { ...value, locale: "fr" },
    } as any);
    await nextTick();
    expect(getCtx().locale.value).toBe("fr");
  });

  it("passes optional translator config fields", () => {
    const { getCtx } = mountProvider({
      config: {
        ...baseConfig,
        translator: {
          loadingMessage: "loading",
          missingMessage: "missing",
        },
      },
      locale: "en",
      handlers: { a: true },
      hooks: { b: true },
    });
    const ctx = getCtx();
    ctx.translator.value;
    expect(Translator).toHaveBeenCalledTimes(1);
    expect(Translator).toHaveBeenCalledWith(
      expect.objectContaining({
        loadingMessage: "loading",
        missingMessage: "missing",
        handlers: { a: true },
        hooks: { b: true },
      }),
    );
  });

  it("handles undefined translator config", () => {
    const { getCtx } = mountProvider({
      config: {
        ...baseConfig,
        translator: undefined,
      },
      locale: "en",
    });
    const ctx = getCtx();
    ctx.translator.value;
    expect(Translator).toHaveBeenCalledTimes(1);
    expect(Translator).toHaveBeenCalledWith(
      expect.not.objectContaining({
        loadingMessage: expect.anything(),
        missingMessage: expect.anything(),
      }),
    );
  });

  it("covers false branch inside watch condition", async () => {
    const value = { config: baseConfig, locale: "en" };
    const { wrapper, getCtx } = mountProvider(value);
    const ctx = getCtx();
    ctx.setLocale("fr");
    await nextTick();
    expect(ctx.locale.value).toBe("fr");
    await wrapper.setProps({ value: { ...value, locale: "fr" } } as any);
    await nextTick();
    expect(ctx.locale.value).toBe("fr");
  });
});
