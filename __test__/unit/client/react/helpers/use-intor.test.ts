// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import * as helperModule from "../../../../../src/client/shared/helpers";
import { useIntor } from "../../../../../src/client/react/helpers/use-intor";

describe("useIntor", () => {
  const baseConfig: any = {
    messages: { en: { hello: "base" } },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes locale from getClientLocale", () => {
    vi.spyOn(helperModule, "getClientLocale").mockReturnValue("en");
    const { result } = renderHook(() => useIntor(baseConfig, vi.fn()));
    expect(result.current.locale).toBe("en");
  });

  it("uses config.messages as initial messages", () => {
    vi.spyOn(helperModule, "getClientLocale").mockReturnValue("en");
    const { result } = renderHook(() => useIntor(baseConfig, vi.fn()));
    expect(result.current.messages).toEqual(baseConfig.messages);
  });

  it("falls back to empty object when config.messages is undefined", () => {
    vi.spyOn(helperModule, "getClientLocale").mockReturnValue("en");
    const { result } = renderHook(() =>
      useIntor({ ...baseConfig, messages: undefined }, vi.fn()),
    );
    expect(result.current.messages).toEqual({});
  });

  it("loads messages on initial render", async () => {
    vi.spyOn(helperModule, "getClientLocale").mockReturnValue("en");
    const loader = vi.fn().mockResolvedValue({
      en: { hello: "loaded" },
    });
    const { result } = renderHook(() => useIntor(baseConfig, loader));
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(loader).toHaveBeenCalledWith(baseConfig, "en");
    expect(result.current.messages).toEqual({
      en: { hello: "loaded" },
    });
  });

  it("exposes onLocaleChange for manual calls", async () => {
    vi.spyOn(helperModule, "getClientLocale").mockReturnValue("en");
    const loader = vi.fn().mockResolvedValue({
      fr: { hello: "bonjour" },
    });
    const { result } = renderHook(() => useIntor(baseConfig, loader));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    await act(async () => {
      await result.current.onLocaleChange?.("fr");
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(loader).toHaveBeenCalledWith(baseConfig, "fr");
    expect(result.current.messages).toEqual({
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
      .mockResolvedValueOnce({ en: { init: true } }) // initial load
      .mockReturnValueOnce(pFr) // fr
      .mockReturnValueOnce(pJa); // ja
    const { result } = renderHook(() => useIntor(baseConfig, loader));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    act(() => {
      result.current.onLocaleChange?.("fr");
      result.current.onLocaleChange?.("ja");
    });
    resolveFr({ fr: { old: true } });
    resolveJa({ ja: { new: true } });
    await act(async () => {
      await Promise.all([pFr, pJa]);
    });
    expect(result.current.messages).toEqual({
      ja: { new: true },
    });
  });
});
