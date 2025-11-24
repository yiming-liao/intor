import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveFallbackLocales } from "@/config/resolvers/resolve-fallback-locales";

describe("resolveFallbackLocales", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns only valid fallback locales", () => {
    const config = {
      defaultLocale: "en",
      fallbackLocales: {
        en: ["zh", "default", "fr"], // fr is invalid
        zh: ["en"],
      },
    };

    const supportedLocales = ["en", "zh"];

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = resolveFallbackLocales(config, supportedLocales);

    expect(result).toEqual({
      en: ["zh", "default"],
      zh: ["en"],
    });

    // Should warn for invalid fallback "fr"
    expect(warnSpy).toHaveBeenCalledWith(
      'Invalid fallback locales for "en"',
      { invalids: ["fr"] },
      { scope: "resolveFallbackLocales" },
    );
  });

  it("handles empty or missing fallbackLocales", () => {
    const config1 = { defaultLocale: "en" };
    const config2 = { defaultLocale: "en", fallbackLocales: undefined };
    const config3 = { defaultLocale: "en", fallbackLocales: null };

    expect(resolveFallbackLocales(config1, ["en", "zh"])).toEqual({});
    expect(resolveFallbackLocales(config2, ["en", "zh"])).toEqual({});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(resolveFallbackLocales(config3 as any, ["en", "zh"])).toEqual({});
  });

  it("filters fallbacks not in supportedLocales", () => {
    const config = {
      defaultLocale: "en",
      fallbackLocales: {
        zh: ["fr", "de", "en"], // only "en" is valid
      },
    };

    const supportedLocales = ["en", "zh"];
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = resolveFallbackLocales(config, supportedLocales);

    expect(result).toEqual({
      zh: ["en"],
    });

    expect(warnSpy).toHaveBeenCalledWith(
      'Invalid fallback locales for "zh"',
      { invalids: ["fr", "de"] },
      { scope: "resolveFallbackLocales" },
    );
  });

  it("handles fallback array containing only 'default'", () => {
    const config = {
      defaultLocale: "en",
      fallbackLocales: {
        en: ["default"],
      },
    };

    const result = resolveFallbackLocales(config, ["en", "zh"]);

    expect(result).toEqual({
      en: ["default"],
    });
  });

  it("handles no supportedLocales provided", () => {
    const config = {
      defaultLocale: "en",
      fallbackLocales: {
        en: ["zh", "fr"],
      },
    };

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = resolveFallbackLocales(config);

    // Only "default" or defaultLocale would be valid, none here
    expect(result).toEqual({});

    expect(warnSpy).toHaveBeenCalledWith(
      'Invalid fallback locales for "en"',
      { invalids: ["zh", "fr"] },
      { scope: "resolveFallbackLocales" },
    );
  });
});
