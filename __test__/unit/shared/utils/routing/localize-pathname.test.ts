/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import { describe, it, expect } from "vitest";
import { localizePathname } from "@/shared/utils/routing/localize-pathname";

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
    const result = localizePathname({
      config,
      pathname: "/app/en-US/about",
      locale: "en-US",
    });
    expect(result).toEqual({
      unprefixedPathname: "/about",
      standardizedPathname: "/app/{locale}/about",
      localizedPathname: "/app/en-US/about",
    });
  });

  it("replaces locale when a different locale is provided", () => {
    const config = createConfig();
    const result = localizePathname({
      config,
      pathname: "/app/en-US/about",
      locale: "zh-TW",
    });
    expect(result.localizedPathname).toBe("/app/zh-TW/about");
  });

  it("handles pathname without an existing locale prefix", () => {
    const config = createConfig();
    const result = localizePathname({
      config,
      pathname: "/app/about",
      locale: "en-US",
    });
    expect(result).toEqual({
      unprefixedPathname: "/about",
      standardizedPathname: "/app/{locale}/about",
      localizedPathname: "/app/en-US/about",
    });
  });

  it('omits locale prefix when routing.prefix is "none"', () => {
    const config = createConfig({
      routing: {
        basePath: "/app",
        prefix: "none",
      } as any,
    });
    const result = localizePathname({
      config,
      pathname: "/app/en-US/about",
      locale: "en-US",
    });
    expect(result).toEqual({
      unprefixedPathname: "/about",
      standardizedPathname: "/app/{locale}/about",
      localizedPathname: "/app/about",
    });
  });

  it('omits locale prefix for default locale when prefix is "except-default"', () => {
    const config = createConfig({
      routing: {
        basePath: "/app",
        prefix: "except-default",
      } as any,
    });
    const result = localizePathname({
      config,
      pathname: "/app/en-US/about",
      locale: "en-US",
    });
    expect(result.localizedPathname).toBe("/app/about");
  });

  it('keeps locale prefix for non-default locale when prefix is "except-default"', () => {
    const config = createConfig({
      routing: {
        basePath: "/app",
        prefix: "except-default",
      } as any,
    });
    const result = localizePathname({
      config,
      pathname: "/app/about",
      locale: "zh-TW",
    });
    expect(result.localizedPathname).toBe("/app/zh-TW/about");
  });
});
