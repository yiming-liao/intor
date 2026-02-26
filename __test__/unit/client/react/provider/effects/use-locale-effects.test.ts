// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import * as utils from "../../../../../../src/client/shared/utils";
import * as policy from "../../../../../../src/policies";
import { useLocaleEffects } from "../../../../../../src/client/react/provider/effects/use-locale-effects";

describe("useLocaleEffects", () => {
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

  it("always sets document locale", () => {
    const spy = vi.spyOn(utils, "setDocumentLocale");
    renderHook(() => useLocaleEffects(baseConfig, "en"));
    expect(spy).toHaveBeenCalledWith("en");
  });

  it("on first visit, persists cookie when policy allows", () => {
    vi.spyOn(utils, "getLocaleFromCookie").mockReturnValue(undefined);
    vi.spyOn(policy, "shouldPersistOnFirstVisit").mockReturnValue(true);
    const setCookieSpy = vi.spyOn(utils, "setLocaleCookie");
    renderHook(() => useLocaleEffects(baseConfig, "en"));
    expect(setCookieSpy).toHaveBeenCalledWith(baseConfig.cookie, "en");
  });

  it("does not persist cookie on first visit if policy denies", () => {
    vi.spyOn(utils, "getLocaleFromCookie").mockReturnValue(undefined);
    vi.spyOn(policy, "shouldPersistOnFirstVisit").mockReturnValue(false);
    const setCookieSpy = vi.spyOn(utils, "setLocaleCookie");
    renderHook(() => useLocaleEffects(baseConfig, "en"));
    expect(setCookieSpy).not.toHaveBeenCalled();
  });

  it("on subsequent locale changes, always persists if enabled", () => {
    vi.spyOn(utils, "getLocaleFromCookie").mockReturnValue("en");
    vi.spyOn(policy, "shouldPersistOnFirstVisit").mockReturnValue(true);
    const setCookieSpy = vi.spyOn(utils, "setLocaleCookie");
    const { rerender } = renderHook(
      ({ locale }) => useLocaleEffects(baseConfig, locale),
      { initialProps: { locale: "en" } },
    );
    act(() => {
      rerender({ locale: "fr" });
    });
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
    const { rerender } = renderHook(
      ({ locale }) => useLocaleEffects(config as any, locale),
      { initialProps: { locale: "en" } },
    );
    rerender({ locale: "fr" });
    expect(setCookieSpy).not.toHaveBeenCalled();
  });
});
