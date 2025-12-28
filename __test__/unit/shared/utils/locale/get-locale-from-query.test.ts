/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { getLocaleFromQuery } from "@/core/utils/locale/get-locale-from-query";

describe("getLocaleFromQuery", () => {
  const config = {
    supportedLocales: ["en", "en-US", "zh-TW"] as const,
    routing: {
      locale: {
        queryKey: "locale",
      },
    },
  } as any;

  it("returns undefined when query is undefined", () => {
    const result = getLocaleFromQuery(config, undefined);
    expect(result).toBe(undefined);
  });

  it("extracts locale from query parameter", () => {
    const result = getLocaleFromQuery(config, { locale: "en" });
    expect(result).toBe("en");
  });

  it("normalizes locale value", () => {
    const result = getLocaleFromQuery(config, { locale: "EN-us" });
    expect(result).toBe("en-US");
  });

  it("returns undefined when query parameter is missing", () => {
    const result = getLocaleFromQuery(config, {});
    expect(result).toBeUndefined();
  });

  it("returns undefined when locale is unsupported", () => {
    const result = getLocaleFromQuery(config, { locale: "fr" });
    expect(result).toBeUndefined();
  });

  it("uses the first value when query parameter is an array", () => {
    const result = getLocaleFromQuery(config, {
      locale: ["zh-TW", "en"],
    });
    expect(result).toBe("zh-TW");
  });

  it("respects custom query key from config", () => {
    const customConfig = {
      ...config,
      routing: {
        locale: {
          queryKey: "lang",
        },
      },
    } as any;

    const result = getLocaleFromQuery(customConfig, { lang: "en" });
    expect(result).toBe("en");
  });

  it("falls back to default query key when queryKey is not configured", () => {
    const configWithoutQueryKey = {
      supportedLocales: ["en", "zh-TW"] as const,
      routing: {
        locale: {},
      },
    } as any;
    const result = getLocaleFromQuery(configWithoutQueryKey, {
      locale: "en",
    });
    expect(result).toBe("en");
  });
});
