import type { LoaderOptions } from "@/config/types/loader.types";
import type { Locale } from "intor-translator";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { changeLocale } from "@/client/react/contexts/locale/utils/change-locale";

describe("changeLocale", () => {
  const mockSetLocaleState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does nothing when newLocale is the same as current locale", () => {
    changeLocale({
      locale: "en-US" as Locale,
      newLocale: "en-US" as Locale,
      setLocaleState: mockSetLocaleState,
    });
    expect(mockSetLocaleState).not.toHaveBeenCalled();
  });

  it("updates locale state when newLocale is different", () => {
    changeLocale({
      locale: "en-US" as Locale,
      newLocale: "zh-TW" as Locale,
      setLocaleState: mockSetLocaleState,
    });
    expect(mockSetLocaleState).toHaveBeenCalledTimes(1);
    expect(mockSetLocaleState).toHaveBeenCalledWith("zh-TW");
  });

  it('warns when using a "local" loader but still updates locale state', () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const loader: LoaderOptions = { type: "local" };
    changeLocale({
      locale: "en-US" as Locale,
      newLocale: "ja-JP" as Locale,
      loader,
      setLocaleState: mockSetLocaleState,
    });
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('using a "local" loader'),
    );

    expect(mockSetLocaleState).toHaveBeenCalledWith("ja-JP");
  });

  it("does not warn when loader is not local", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const loader: LoaderOptions = { type: "remote", remoteUrl: "" };
    changeLocale({
      locale: "en-US" as Locale,
      newLocale: "fr-FR" as Locale,
      loader,
      setLocaleState: mockSetLocaleState,
    });
    expect(warnSpy).not.toHaveBeenCalled();
    expect(mockSetLocaleState).toHaveBeenCalledWith("fr-FR");
  });
});
