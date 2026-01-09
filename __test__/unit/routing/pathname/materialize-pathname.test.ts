/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "@/config";
import { describe, it, expect } from "vitest";
import { materializePathname } from "@/routing/pathname/materialize-pathname";

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

describe("materializePathname", () => {
  it('replaces locale placeholder when prefix is "all"', () => {
    const config = createConfig({ routing: { localePrefix: "all" } as any });
    const result = materializePathname("/app/{locale}/about", config, "en-US");
    expect(result).toBe("/app/en-US/about");
  });

  it('removes locale placeholder when prefix is "none"', () => {
    const config = createConfig({ routing: { localePrefix: "none" } as any });
    const result = materializePathname("/app/{locale}/about", config, "en-US");
    expect(result).toBe("/app/about");
  });

  it('removes locale placeholder for default locale when prefix is "except-default"', () => {
    const config = createConfig({
      routing: { localePrefix: "except-default" } as any,
    });
    const result = materializePathname("/app/{locale}/about", config, "en-US");
    expect(result).toBe("/app/about");
  });

  it('keeps locale placeholder for non-default locale when prefix is "except-default"', () => {
    const config = createConfig({
      routing: { localePrefix: "except-default" } as any,
    });
    const result = materializePathname("/app/{locale}/about", config, "zh-TW");
    expect(result).toBe("/app/zh-TW/about");
  });

  it("throws when locale is missing and prefix requires locale", () => {
    const config = createConfig({ routing: { localePrefix: "all" } as any });
    expect(() =>
      materializePathname("/app/{locale}/about", config),
    ).toThrowError(/No locale/);
  });

  it('does not throw when locale is missing and prefix is "none"', () => {
    const config = createConfig({ routing: { localePrefix: "none" } as any });
    const result = materializePathname("/app/{locale}/about", config);
    expect(result).toBe("/app/about");
  });
});
