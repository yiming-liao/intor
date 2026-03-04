import type { IntorResolvedConfig } from "../../../../../src/config";
import type { LocaleContext } from "../../../../../src/routing/inbound/resolve-locale/types";
import { describe, it, expect } from "vitest";
import { resolveLocale } from "../../../../../src/routing/inbound/resolve-locale/resolve-locale";

const baseConfig = {
  supportedLocales: ["en-US", "zh-TW"] as const,
  defaultLocale: "en-US",
  routing: {
    inbound: {
      localeSources: ["path", "cookie", "detected"],
    },
  },
} as unknown as IntorResolvedConfig;

describe("resolveLocale", () => {
  it("resolves locale from the first normalized configured signal", () => {
    const context: LocaleContext = {
      path: { locale: "fr-FR" },
      cookie: { locale: "en-US" },
      detected: { locale: "zh-TW" },
    };
    const result = resolveLocale(baseConfig, context);
    expect(result).toEqual({
      locale: "en-US",
      localeSource: "cookie",
    });
  });

  it("skips unsupported configured signals and uses detected", () => {
    const context: LocaleContext = {
      cookie: { locale: "fr" },
      detected: { locale: "zh-TW" },
    };
    const result = resolveLocale(baseConfig, context);
    expect(result).toEqual({
      locale: "zh-TW",
      localeSource: "detected",
    });
  });

  it("uses detected when no configured signal matches", () => {
    const context: LocaleContext = {
      path: {},
      cookie: {},
      detected: { locale: "zh-TW" },
    };
    const result = resolveLocale(baseConfig, context);
    expect(result).toEqual({
      locale: "zh-TW",
      localeSource: "detected",
    });
  });

  it("falls back to default when detected cannot be normalized", () => {
    const context: LocaleContext = {
      path: {},
      cookie: {},
      detected: { locale: "fr-FR" },
    };
    const result = resolveLocale(baseConfig, context);
    expect(result).toEqual({
      locale: "en-US",
      localeSource: "default",
    });
  });

  it("respects custom configured signal priority order", () => {
    const config = {
      ...baseConfig,
      routing: {
        inbound: {
          localeSources: ["cookie", "path", "detected"],
        },
      },
    } as IntorResolvedConfig;
    const context: LocaleContext = {
      path: { locale: "zh-TW" },
      cookie: { locale: "en-US" },
      detected: { locale: "zh-TW" },
    };
    const result = resolveLocale(config, context);
    expect(result).toEqual({
      locale: "en-US",
      localeSource: "cookie",
    });
  });

  it("uses detected even if not explicitly listed in localeSources", () => {
    const config = {
      ...baseConfig,
      routing: {
        inbound: {
          localeSources: ["path", "cookie"],
        },
      },
    } as IntorResolvedConfig;
    const context: LocaleContext = {
      detected: { locale: "zh-TW" },
    };
    const result = resolveLocale(config, context);
    expect(result).toEqual({
      locale: "zh-TW",
      localeSource: "detected",
    });
  });

  it("guarantees a supported locale is always returned", () => {
    const context: LocaleContext = {
      detected: { locale: "unknown" },
    };
    const result = resolveLocale(baseConfig, context);
    expect(baseConfig.supportedLocales).toContain(result.locale);
  });
});
