import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import { describe, it, expect } from "vitest";
import { extractPathname } from "@/shared/utils/routing/extract-pathname";

const createConfig = (
  overrides?: Partial<IntorResolvedConfig>,
): IntorResolvedConfig =>
  ({
    defaultLocale: "en-US",
    supportedLocales: ["en-US", "fr", "de"],
    routing: {
      basePath: "/app",
      prefix: "all", // irrelevant for extract
      ...overrides?.routing,
    },
    ...overrides,
  }) as IntorResolvedConfig;

describe("extractPathname (canonical)", () => {
  it("extracts basePath and strips supported locale", () => {
    const config = createConfig();
    const result = extractPathname({
      config,
      pathname: "/app/en-US/about",
    });
    expect(result).toEqual({
      basePath: "/app",
      prefixedPathname: "/en-US/about",
      unprefixedPathname: "/about",
      maybeLocale: "en-US",
      isLocalePrefixed: true,
    });
  });

  it("strips locale regardless of prefix strategy", () => {
    const config = createConfig({
      routing: { prefix: "none", basePath: "/app", firstVisit: {} },
    });
    const result = extractPathname({
      config,
      pathname: "/app/de/help",
    });
    expect(result.unprefixedPathname).toBe("/help");
    expect(result.maybeLocale).toBe("de");
    expect(result.isLocalePrefixed).toBe(true);
  });

  it("handles pathnames without locale prefix", () => {
    const config = createConfig();
    const result = extractPathname({
      config,
      pathname: "/app/about",
    });
    expect(result).toEqual({
      basePath: "/app",
      prefixedPathname: "/about",
      unprefixedPathname: "/about",
      maybeLocale: "about",
      isLocalePrefixed: false,
    });
  });

  it("returns root pathname when locale is the only segment", () => {
    const config = createConfig();
    const result = extractPathname({
      config,
      pathname: "/app/fr",
    });
    expect(result).toEqual({
      basePath: "/app",
      prefixedPathname: "/fr",
      unprefixedPathname: "/",
      maybeLocale: "fr",
      isLocalePrefixed: true,
    });
  });

  it("does not strip unsupported locale-like segments", () => {
    const config = createConfig({
      supportedLocales: ["en-US"],
    });
    const result = extractPathname({
      config,
      pathname: "/app/de/about",
    });
    expect(result).toEqual({
      basePath: "/app",
      prefixedPathname: "/de/about",
      unprefixedPathname: "/de/about",
      maybeLocale: "de",
      isLocalePrefixed: false,
    });
  });

  it("handles pathname equal to basePath", () => {
    const config = createConfig();
    const result = extractPathname({
      config,
      pathname: "/app",
    });
    expect(result).toEqual({
      basePath: "/app",
      prefixedPathname: "/",
      unprefixedPathname: "/",
      maybeLocale: undefined,
      isLocalePrefixed: false,
    });
  });
});
