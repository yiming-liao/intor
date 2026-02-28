/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "../../../../src/config";
import { describe, it, expect } from "vitest";
import { materializePathname } from "../../../../src/routing/pathname/materialize-pathname";

const createConfig = (
  overrides?: Partial<IntorResolvedConfig>,
): IntorResolvedConfig =>
  ({
    defaultLocale: "en",
    supportedLocales: ["en", "zh"],
    routing: {
      basePath: "/app",
      localePrefix: "all",
      ...overrides?.routing,
    },
    ...overrides,
  }) as IntorResolvedConfig;

describe("materializePathname", () => {
  describe('localePrefix: "all"', () => {
    it("injects locale into non-root path", () => {
      const config = createConfig({ routing: { localePrefix: "all" } as any });
      expect(materializePathname("/app/{locale}/about", config, "en")).toBe(
        "/app/en/about",
      );
    });

    it("injects locale into root path", () => {
      const config = createConfig({ routing: { localePrefix: "all" } as any });
      expect(materializePathname("/app/{locale}", config, "en")).toBe(
        "/app/en",
      );
    });
  });

  describe('localePrefix: "none"', () => {
    it("removes locale segment from non-root path", () => {
      const config = createConfig({ routing: { localePrefix: "none" } as any });
      expect(materializePathname("/app/{locale}/about", config, "en")).toBe(
        "/app/about",
      );
    });

    it("removes locale segment from root path and preserves '/'", () => {
      const config = createConfig({ routing: { localePrefix: "none" } as any });
      expect(materializePathname("/app/{locale}", config, "en")).toBe("/app");
    });

    it("handles minimal placeholder and returns '/'", () => {
      const config = createConfig({ routing: { localePrefix: "none" } as any });
      expect(materializePathname("/{locale}", config, "en")).toBe("/");
    });
  });

  describe('localePrefix: "except-default"', () => {
    it("removes locale for default locale", () => {
      const config = createConfig({
        routing: { localePrefix: "except-default" } as any,
      });
      expect(materializePathname("/app/{locale}/about", config, "en")).toBe(
        "/app/about",
      );
    });

    it("injects locale for non-default locale", () => {
      const config = createConfig({
        routing: { localePrefix: "except-default" } as any,
      });
      expect(materializePathname("/app/{locale}/about", config, "zh")).toBe(
        "/app/zh/about",
      );
    });

    it("removes locale for default locale at root", () => {
      const config = createConfig({
        routing: { localePrefix: "except-default" } as any,
      });
      expect(materializePathname("/app/{locale}", config, "en")).toBe("/app");
    });
  });

  describe("without basePath", () => {
    it("works with root basePath", () => {
      const config = createConfig({
        routing: { basePath: "/", localePrefix: "all" } as any,
      });
      expect(materializePathname("/{locale}/about", config, "en")).toBe(
        "/en/about",
      );
    });
  });
});
