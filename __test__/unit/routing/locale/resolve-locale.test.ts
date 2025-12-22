import type { IntorResolvedConfig } from "@/config";
import type { LocaleContext } from "@/routing/locale/types";
import { describe, it, expect } from "vitest";
import { resolveLocale } from "@/routing/locale/resolve-locale";

const baseConfig = {
  routing: {
    locale: {
      sources: ["path", "cookie", "detected"],
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
      source: "path",
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
      source: "cookie",
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
      source: "detected",
    });
  });

  it("respects custom source priority order", () => {
    const config = {
      routing: {
        locale: {
          sources: ["cookie", "path", "detected"],
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
      source: "cookie",
    });
  });

  it("falls back to detected locale when 'detected' is not listed in sources", () => {
    const config = {
      routing: {
        locale: {
          sources: ["path", "cookie"],
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
      source: "detected",
    });
  });
});
