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
  it("resolves locale from the first source that can be normalized", () => {
    const context: LocaleContext = {
      path: { locale: "fr-FR" }, // unsupported
      cookie: { locale: "en-US" }, // supported
      detected: { locale: "zh-TW" },
    };
    const result = resolveLocale(baseConfig, context);
    expect(result).toEqual({
      locale: "en-US",
      localeSource: "cookie",
    });
  });

  it("skips sources that cannot be normalized", () => {
    const context: LocaleContext = {
      cookie: { locale: "fr" }, // unsupported
      detected: { locale: "zh-TW" },
    };
    const result = resolveLocale(baseConfig, context);
    expect(result).toEqual({
      locale: "zh-TW",
      localeSource: "detected",
    });
  });

  it("falls back to detected locale when no configured source matches", () => {
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

  it("falls back to defaultLocale when detected locale cannot be normalized", () => {
    const context: LocaleContext = {
      path: {},
      cookie: {},
      detected: { locale: "fr-FR" }, // unsupported
    };
    const result = resolveLocale(baseConfig, context);
    expect(result).toEqual({
      locale: "en-US",
      localeSource: "detected",
    });
  });

  it("respects custom source priority order", () => {
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

  it("falls back to detected even if detected is not listed in localeSources", () => {
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
});
