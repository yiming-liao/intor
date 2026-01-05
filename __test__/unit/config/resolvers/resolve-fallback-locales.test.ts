import type { IntorRawConfig } from "@/config";
import { describe, it, expect, vi } from "vitest";
import { resolveFallbackLocales } from "@/config/resolvers/resolve-fallback-locales";

vi.mock("@/core", () => ({
  getLogger: () => ({ child: () => ({ warn: vi.fn() }) }),
}));

describe("resolveFallbackLocales", () => {
  const baseConfig: IntorRawConfig = {
    id: "TEST_ID",
    defaultLocale: "en",
    supportedLocales: ["en", "zh"],
  };

  const supportedSet = new Set(["en", "zh"]);

  it("returns empty object when fallbackLocales is not provided", () => {
    const result = resolveFallbackLocales(baseConfig, "TEST_ID", supportedSet);
    expect(result).toEqual({});
  });

  it("ignores fallback rules for unsupported locale keys", () => {
    const result = resolveFallbackLocales(
      { ...baseConfig, fallbackLocales: { fr: ["en"] } },
      "TEST_ID",
      supportedSet,
    );
    expect(result).toEqual({});
  });

  it("keeps valid fallback locales and literal 'default'", () => {
    const result = resolveFallbackLocales(
      { ...baseConfig, fallbackLocales: { zh: ["en", "default"] } },
      "TEST_ID",
      supportedSet,
    );
    expect(result).toEqual({ zh: ["en", "default"] });
  });

  it("filters out invalid fallback targets", () => {
    const result = resolveFallbackLocales(
      { ...baseConfig, fallbackLocales: { zh: ["en", "jp", "default"] } },
      "TEST_ID",
      supportedSet,
    );
    expect(result).toEqual({ zh: ["en", "default"] });
  });

  it("returns empty mapping when all fallback targets are invalid", () => {
    const result = resolveFallbackLocales(
      { ...baseConfig, fallbackLocales: { zh: ["jp", "kr"] } },
      "TEST_ID",
      supportedSet,
    );
    expect(result).toEqual({});
  });
});
