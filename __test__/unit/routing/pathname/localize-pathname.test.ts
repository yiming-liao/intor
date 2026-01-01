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
      prefix: "all",
      ...overrides?.routing,
    },
    ...overrides,
  }) as IntorResolvedConfig;

describe("localizePathname", () => {
  it("canonicalizes, standardizes, and localizes a pathname (prefix: all)", () => {
    const config = createConfig();
    const result = localizePathname(config, "/app/en-US/about", "en-US");
    expect(result).toEqual({
      unprefixedPathname: "/about",
      standardizedPathname: "/app/{locale}/about",
      pathname: "/app/en-US/about",
    });
  });

  it("replaces locale when a different locale is provided", () => {
    const config = createConfig();
    const result = localizePathname(config, "/app/en-US/about", "zh-TW");
    expect(result.pathname).toBe("/app/zh-TW/about");
  });

  it("handles pathname without an existing locale prefix", () => {
    const config = createConfig();
    const result = localizePathname(config, "/app/about", "en-US");
    expect(result).toEqual({
      unprefixedPathname: "/about",
      standardizedPathname: "/app/{locale}/about",
      pathname: "/app/en-US/about",
    });
  });

  it('omits locale prefix when routing.prefix is "none"', () => {
    const config = createConfig({
      routing: {
        basePath: "/app",
        prefix: "none",
      } as any,
    });
    const result = localizePathname(config, "/app/en-US/about", "en-US");
    expect(result).toEqual({
      unprefixedPathname: "/about",
      standardizedPathname: "/app/{locale}/about",
      pathname: "/app/about",
    });
  });

  it('omits locale prefix for default locale when prefix is "except-default"', () => {
    const config = createConfig({
      routing: {
        basePath: "/app",
        prefix: "except-default",
      } as any,
    });
    const result = localizePathname(config, "/app/en-US/about", "en-US");
    expect(result.pathname).toBe("/app/about");
  });

  it('keeps locale prefix for non-default locale when prefix is "except-default"', () => {
    const config = createConfig({
      routing: {
        basePath: "/app",
        prefix: "except-default",
      } as any,
    });
    const result = localizePathname(config, "/app/about", "zh-TW");
    expect(result.pathname).toBe("/app/zh-TW/about");
  });
});
