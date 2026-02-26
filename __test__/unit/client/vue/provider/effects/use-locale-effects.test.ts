import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, nextTick } from "vue";
import * as utils from "../../../../../../src/client/shared/utils";
import * as policy from "../../../../../../src/policies";
import { useLocaleEffects } from "../../../../../../src/client/vue/provider/effects/use-locale-effects";

describe("useLocaleEffects (vue)", () => {
  const baseConfig: any = {
    cookie: {
      name: "locale",
      persist: true,
    },
    routing: {
      inbound: {
        firstVisit: {
          persist: true,
        },
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("always sets document locale", async () => {
    const spy = vi.spyOn(utils, "setDocumentLocale");
    const locale = ref("en");
    useLocaleEffects(baseConfig, locale);
    await nextTick();
    expect(spy).toHaveBeenCalledWith("en");
  });

  it("on first visit, persists cookie when policy allows", async () => {
    vi.spyOn(utils, "getLocaleFromCookie").mockReturnValue(undefined);
    vi.spyOn(policy, "shouldPersistOnFirstVisit").mockReturnValue(true);
    const setCookieSpy = vi.spyOn(utils, "setLocaleCookie");
    const locale = ref("en");
    useLocaleEffects(baseConfig, locale);
    await nextTick();
    expect(setCookieSpy).toHaveBeenCalledWith(baseConfig.cookie, "en");
  });

  it("does not persist cookie on first visit if policy denies", async () => {
    vi.spyOn(utils, "getLocaleFromCookie").mockReturnValue(undefined);
    vi.spyOn(policy, "shouldPersistOnFirstVisit").mockReturnValue(false);
    const setCookieSpy = vi.spyOn(utils, "setLocaleCookie");
    const locale = ref("en");
    useLocaleEffects(baseConfig, locale);
    await nextTick();
    expect(setCookieSpy).not.toHaveBeenCalled();
  });

  it("on subsequent locale changes, always persists if enabled", async () => {
    vi.spyOn(utils, "getLocaleFromCookie").mockReturnValue("en");
    vi.spyOn(policy, "shouldPersistOnFirstVisit").mockReturnValue(true);
    const setCookieSpy = vi.spyOn(utils, "setLocaleCookie");
    const locale = ref("en");
    useLocaleEffects(baseConfig, locale);
    await nextTick();
    locale.value = "fr";
    await nextTick();
    expect(setCookieSpy).toHaveBeenCalledWith(baseConfig.cookie, "fr");
  });

  it("does not persist on subsequent changes when cookie.persist is false", async () => {
    const config = {
      ...baseConfig,
      cookie: {
        ...baseConfig.cookie,
        persist: false,
      },
    };
    vi.spyOn(utils, "getLocaleFromCookie").mockReturnValue("en");
    vi.spyOn(policy, "shouldPersistOnFirstVisit").mockReturnValue(true);
    const setCookieSpy = vi.spyOn(utils, "setLocaleCookie");
    const locale = ref("en");
    useLocaleEffects(config as any, locale);
    await nextTick();
    locale.value = "fr";
    await nextTick();
    expect(setCookieSpy).not.toHaveBeenCalled();
  });
});
