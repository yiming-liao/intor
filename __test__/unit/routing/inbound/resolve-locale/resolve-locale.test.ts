import type { IntorResolvedConfig } from "@/config";
import type { LocaleContext } from "@/routing/inbound/resolve-locale/types";
import { describe, it, expect } from "vitest";
import { resolveLocale } from "@/routing/inbound/resolve-locale/resolve-locale";

const baseConfig = {
  routing: {
    inbound: {
      localeSources: ["path", "cookie", "detected"],
    },
  },
} as IntorResolvedConfig;

describe("resolveLocale", () => {
  it("resolves locale from the first matching source", () => {
    const context: LocaleContext = {
      path: { locale: "fr-FR" },
      cookie: { locale: "en-US" },
      detected: { locale: "zh-TW" },
    };
    const result = resolveLocale(baseConfig, context);
    expect(result).toEqual({
      locale: "fr-FR",
      localeSource: "path",
    });
  });

  it("skips empty sources and resolves from the next available one", () => {
    const context: LocaleContext = {
      path: { locale: undefined },
      cookie: { locale: "en-US" },
      detected: { locale: "zh-TW" },
    };
    const result = resolveLocale(baseConfig, context);
    expect(result).toEqual({
      locale: "en-US",
      localeSource: "cookie",
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

  it("respects custom source priority order", () => {
    const config = {
      routing: {
        inbound: {
          localeSources: ["cookie", "path", "detected"],
        },
      },
    } as IntorResolvedConfig;
    const context: LocaleContext = {
      path: { locale: "fr-FR" },
      cookie: { locale: "en-US" },
      detected: { locale: "zh-TW" },
    };
    const result = resolveLocale(config, context);
    expect(result).toEqual({
      locale: "en-US",
      localeSource: "cookie",
    });
  });

  it("falls back to detected locale when 'detected' is not listed in sources", () => {
    const config = {
      routing: {
        inbound: {
          localeSources: ["path", "cookie"],
        },
      },
    } as IntorResolvedConfig;
    const context: LocaleContext = {
      path: {},
      cookie: {},
      detected: { locale: "zh-TW" },
    };
    const result = resolveLocale(config, context);
    expect(result).toEqual({
      locale: "zh-TW",
      localeSource: "detected",
    });
  });
});
