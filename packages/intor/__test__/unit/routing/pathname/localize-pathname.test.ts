/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "../../../../src/config";
import { describe, it, expect } from "vitest";
import { localizePathname } from "../../../../src/routing/pathname/localize-pathname";

const createConfig = (
  overrides?: Partial<IntorResolvedConfig>,
): IntorResolvedConfig => {
  const baseConfig = {
    defaultLocale: "en",
    supportedLocales: ["en", "zh"],
    routing: { basePath: "/app", localePrefix: "all" },
  };
  return {
    ...baseConfig,
    ...overrides,
    routing: { ...baseConfig.routing, ...overrides?.routing },
  } as IntorResolvedConfig;
};

describe("localizePathname", () => {
  describe("prefix: all", () => {
    it("round-trips existing localized path", () => {
      const config = createConfig();
      const result = localizePathname("/app/en/about", config, "en");
      expect(result.canonicalPathname).toBe("/about");
      expect(result.templatedPathname).toBe("/app/{locale}/about");
      expect(result.pathname).toBe("/app/en/about");
    });

    it("rebinds to a different locale", () => {
      const config = createConfig();
      const result = localizePathname("/app/en/about", config, "zh");
      expect(result.pathname).toBe("/app/zh/about");
    });

    it("handles root path", () => {
      const config = createConfig();
      const result = localizePathname("/app/en", config, "en");
      expect(result.canonicalPathname).toBe("/");
      expect(result.templatedPathname).toBe("/app/{locale}");
      expect(result.pathname).toBe("/app/en");
    });
  });

  describe("prefix: none", () => {
    it("removes locale segment", () => {
      const config = createConfig({
        routing: { localePrefix: "none" } as any,
      });
      const result = localizePathname("/app/en/about", config, "en");
      expect(result.pathname).toBe("/app/about");
      expect(result.templatedPathname).toBe("/app/{locale}/about");
    });

    it("root stays valid", () => {
      const config = createConfig({
        routing: { localePrefix: "none" } as any,
      });
      const result = localizePathname("/app/en", config, "en");
      expect(result.pathname).toBe("/app");
    });
  });

  describe("prefix: except-default", () => {
    it("removes default locale", () => {
      const config = createConfig({
        routing: { localePrefix: "except-default" } as any,
      });
      const result = localizePathname("/app/en/about", config, "en");
      expect(result.pathname).toBe("/app/about");
    });

    it("keeps non-default locale", () => {
      const config = createConfig({
        routing: { localePrefix: "except-default" } as any,
      });
      const result = localizePathname("/app/about", config, "zh");
      expect(result.pathname).toBe("/app/zh/about");
    });
  });

  describe("without basePath", () => {
    it("works when basePath is root", () => {
      const config = createConfig({
        routing: { basePath: "/", localePrefix: "all" } as any,
      });
      const result = localizePathname("/en/about", config, "zh");
      expect(result.pathname).toBe("/zh/about");
    });
  });
});
