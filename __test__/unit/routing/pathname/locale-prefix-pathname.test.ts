/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "@/config";
import { describe, it, expect } from "vitest";
import { localePrefixPathname } from "@/routing/pathname/locale-prefix-pathname";

const createConfig = (
  overrides?: Partial<IntorResolvedConfig>,
): IntorResolvedConfig =>
  ({
    defaultLocale: "en-US",
    supportedLocales: ["en-US", "zh-TW"],
    routing: {
      basePath: "/app",
      navigation: { path: { prefix: "all" } },
      ...overrides?.routing,
    },
    ...overrides,
  }) as IntorResolvedConfig;

describe("localePrefixPathname", () => {
  it('replaces locale placeholder when prefix is "all"', () => {
    const config = createConfig({
      routing: { navigation: { path: { prefix: "all" } } } as any,
    });
    const result = localePrefixPathname(config, "/app/{locale}/about", "en-US");
    expect(result).toBe("/app/en-US/about");
  });

  it('removes locale placeholder when prefix is "none"', () => {
    const config = createConfig({
      routing: { navigation: { path: { prefix: "none" } } } as any,
    });
    const result = localePrefixPathname(config, "/app/{locale}/about", "en-US");
    expect(result).toBe("/app/about");
  });

  it('removes locale placeholder for default locale when prefix is "except-default"', () => {
    const config = createConfig({
      routing: { navigation: { path: { prefix: "except-default" } } } as any,
    });
    const result = localePrefixPathname(config, "/app/{locale}/about", "en-US");
    expect(result).toBe("/app/about");
  });

  it('keeps locale placeholder for non-default locale when prefix is "except-default"', () => {
    const config = createConfig({
      routing: { navigation: { path: { prefix: "except-default" } } } as any,
    });
    const result = localePrefixPathname(config, "/app/{locale}/about", "zh-TW");
    expect(result).toBe("/app/zh-TW/about");
  });

  it("throws when locale is missing and prefix requires locale", () => {
    const config = createConfig({
      routing: { navigation: { path: { prefix: "all" } } } as any,
    });
    expect(() =>
      localePrefixPathname(config, "/app/{locale}/about"),
    ).toThrowError(/No locale/);
  });

  it('does not throw when locale is missing and prefix is "none"', () => {
    const config = createConfig({
      routing: { navigation: { path: { prefix: "none" } } } as any,
    });
    const result = localePrefixPathname(config, "/app/{locale}/about");
    expect(result).toBe("/app/about");
  });
});
