// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import * as helperModule from "../../../../../src/client/shared/helpers";
import { useIntor } from "../../../../../src/client/vue/helpers/use-intor";

describe("useIntor (vue)", () => {
  const baseConfig: any = {
    messages: { en: { hello: "base" } },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function mountUseIntor(loader: any) {
    let exposed: any;
    const Test = {
      setup() {
        exposed = useIntor(baseConfig, loader);
        return {};
      },
      template: "<div />",
    };
    mount(Test);
    return () => exposed;
  }

  it("initializes locale from getClientLocale", () => {
    vi.spyOn(helperModule, "getClientLocale").mockReturnValue("en");
    const getResult = mountUseIntor(vi.fn());
    expect(getResult().locale).toBe("en");
  });

  it("uses config.messages as initial messages", () => {
    vi.spyOn(helperModule, "getClientLocale").mockReturnValue("en");
    const getResult = mountUseIntor(vi.fn());
    expect(getResult().messages.value).toEqual(baseConfig.messages);
  });

  it("falls back to empty object when config.messages is undefined", () => {
    vi.spyOn(helperModule, "getClientLocale").mockReturnValue("en");
    const config = { ...baseConfig, messages: undefined };
    let exposed: any;
    const Test = {
      setup() {
        exposed = useIntor(config as any, vi.fn());
        return {};
      },
      template: "<div />",
    };
    mount(Test);
    expect(exposed.messages.value).toEqual({});
  });

  it("loads messages on initial mount", async () => {
    vi.spyOn(helperModule, "getClientLocale").mockReturnValue("en");
    const loader = vi.fn().mockResolvedValue({
      en: { hello: "loaded" },
    });
    const getResult = mountUseIntor(loader);
    expect(getResult().isLoading.value).toBe(true);
    await nextTick();
    await Promise.resolve();
    expect(loader).toHaveBeenCalledWith(baseConfig, "en");
    expect(getResult().isLoading.value).toBe(false);
    expect(getResult().messages.value).toEqual({
      en: { hello: "loaded" },
    });
  });

  it("exposes onLocaleChange for manual calls", async () => {
    vi.spyOn(helperModule, "getClientLocale").mockReturnValue("en");
    const loader = vi.fn().mockResolvedValue({
      fr: { hello: "bonjour" },
    });
    const getResult = mountUseIntor(loader);
    await nextTick();
    await Promise.resolve();
    await getResult().onLocaleChange("fr");
    await Promise.resolve();
    expect(loader).toHaveBeenCalledWith(baseConfig, "fr");
    expect(getResult().messages.value).toEqual({
      fr: { hello: "bonjour" },
    });
  });

  it("ignores outdated loader results (race condition)", async () => {
    vi.spyOn(helperModule, "getClientLocale").mockReturnValue("en");
    let resolveFr!: any;
    let resolveJa!: any;
    const pFr = new Promise((res) => (resolveFr = res));
    const pJa = new Promise((res) => (resolveJa = res));
    const loader = vi
      .fn()
      .mockResolvedValueOnce({ en: { init: true } })
      .mockReturnValueOnce(pFr)
      .mockReturnValueOnce(pJa);
    const getResult = mountUseIntor(loader);
    await nextTick();
    await Promise.resolve();
    getResult().onLocaleChange("fr");
    getResult().onLocaleChange("ja");
    resolveFr({ fr: { old: true } });
    resolveJa({ ja: { new: true } });
    await Promise.all([pFr, pJa]);
    expect(getResult().messages.value).toEqual({
      ja: { new: true },
    });
  });
});
