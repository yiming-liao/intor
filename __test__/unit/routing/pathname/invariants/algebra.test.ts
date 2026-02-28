import { describe, it, expect } from "vitest";
import { canonicalizePathname } from "../../../../../src/routing/pathname/canonicalize-pathname";
import { standardizePathname } from "../../../../../src/routing/pathname/standardize-pathname";
import { materializePathname } from "../../../../../src/routing/pathname/materialize-pathname";

describe("routing algebra invariants", () => {
  const config = {
    defaultLocale: "en",
    supportedLocales: ["en", "zh"],
    routing: {
      basePath: "/app",
      localePrefix: "except-default",
    },
  } as any;

  const samples = [
    "/app/en/about",
    "/app/zh/about",
    "/app/about",
    "/app/en",
    "/app",
    "/about",
    "/",
  ];

  for (const raw of samples) {
    it(`preserves canonical identity for: ${raw}`, () => {
      const canonical = canonicalizePathname(raw, config);
      const standardized = standardizePathname(canonical, config);

      const localizedEn = materializePathname(standardized, config, "en");

      const localizedZh = materializePathname(standardized, config, "zh");

      expect(canonicalizePathname(localizedEn, config)).toBe(canonical);

      expect(canonicalizePathname(localizedZh, config)).toBe(canonical);
    });
  }
});
