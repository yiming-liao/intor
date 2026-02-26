import { describe, it, expect, vi, beforeEach } from "vitest";
import { writable } from "svelte/store";
import * as utils from "../../../../../../src/client/shared/utils";
import * as policy from "../../../../../../src/policies";
import { attachLocaleEffects } from "../../../../../../src/client/svelte/provider/effects/attach-locale-effects";

describe("attachLocaleEffects (svelte)", () => {
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

  it("always sets document locale on initial subscribe", () => {
    const spy = vi.spyOn(utils, "setDocumentLocale");
    const locale = writable("en");
    attachLocaleEffects(locale, baseConfig);
    expect(spy).toHaveBeenCalledWith("en");
  });

  it("on first visit, persists cookie when policy allows", () => {
    vi.spyOn(utils, "getLocaleFromCookie").mockReturnValue(undefined);
    vi.spyOn(policy, "shouldPersistOnFirstVisit").mockReturnValue(true);
    const setCookieSpy = vi.spyOn(utils, "setLocaleCookie");
    const locale = writable("en");
    attachLocaleEffects(locale, baseConfig);
    expect(setCookieSpy).toHaveBeenCalledWith(baseConfig.cookie, "en");
  });

  it("does not persist cookie on first visit if policy denies", () => {
    vi.spyOn(utils, "getLocaleFromCookie").mockReturnValue(undefined);
    vi.spyOn(policy, "shouldPersistOnFirstVisit").mockReturnValue(false);
    const setCookieSpy = vi.spyOn(utils, "setLocaleCookie");
    const locale = writable("en");
    attachLocaleEffects(locale, baseConfig);
    expect(setCookieSpy).not.toHaveBeenCalled();
  });

  it("on subsequent locale changes, persists when enabled", () => {
    vi.spyOn(utils, "getLocaleFromCookie").mockReturnValue("en");
    vi.spyOn(policy, "shouldPersistOnFirstVisit").mockReturnValue(true);
    const setCookieSpy = vi.spyOn(utils, "setLocaleCookie");
    const locale = writable("en");
    attachLocaleEffects(locale, baseConfig);
    locale.set("fr");
    expect(setCookieSpy).toHaveBeenCalledWith(baseConfig.cookie, "fr");
  });

  it("does not persist on subsequent changes when cookie.persist is false", () => {
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
    const locale = writable("en");
    attachLocaleEffects(locale, config as any);
    locale.set("fr");
    expect(setCookieSpy).not.toHaveBeenCalled();
  });
});
