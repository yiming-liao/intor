/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "@/config";
import { describe, it, expect } from "vitest";
import { localizePathname } from "@/routing/pathname/localize-pathname";

const createConfig = (
  overrides?: Partial<IntorResolvedConfig>,
): IntorResolvedConfig =>
  ({
    defaultLocale: "en-US",
    supportedLocales: ["en-US", "zh-TW"],
    routing: {
      basePath: "/app",
      localePrefix: "all",
      ...overrides?.routing,
    },
    ...overrides,
  }) as IntorResolvedConfig;

describe("localizePathname", () => {
  it("canonicalizes, standardizes, and localizes a pathname (prefix: all)", () => {
    const config = createConfig();
    const result = localizePathname("/app/en-US/about", config, "en-US");
    expect(result).toEqual({
      pathname: "/app/en-US/about",
      unprefixedPathname: "/about",
      templatedPathname: "/app/{locale}/about",
    });
  });

  it("replaces locale when a different locale is provided", () => {
    const config = createConfig();
    const result = localizePathname("/app/en-US/about", config, "zh-TW");
    expect(result.pathname).toBe("/app/zh-TW/about");
  });

  it("handles pathname without an existing locale prefix", () => {
    const config = createConfig();
    const result = localizePathname("/app/about", config, "en-US");
    expect(result).toEqual({
      pathname: "/app/en-US/about",
      unprefixedPathname: "/about",
      templatedPathname: "/app/{locale}/about",
    });
  });

  it('omits locale prefix when routing.prefix is "none"', () => {
    const config = createConfig({
      routing: {
        basePath: "/app",
        localePrefix: "none",
      } as any,
    });
    const result = localizePathname("/app/en-US/about", config, "en-US");
    expect(result).toEqual({
      pathname: "/app/about",
      unprefixedPathname: "/about",
      templatedPathname: "/app/{locale}/about",
    });
  });

  it('omits locale prefix for default locale when prefix is "except-default"', () => {
    const config = createConfig({
      routing: {
        basePath: "/app",
        localePrefix: "except-default",
      } as any,
    });
    const result = localizePathname("/app/en-US/about", config, "en-US");
    expect(result.pathname).toBe("/app/about");
  });

  it('keeps locale prefix for non-default locale when prefix is "except-default"', () => {
    const config = createConfig({
      routing: {
        basePath: "/app",
        localePrefix: "except-default",
      } as any,
    });
    const result = localizePathname("/app/about", config, "zh-TW");
    expect(result.pathname).toBe("/app/zh-TW/about");
  });
});
