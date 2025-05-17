import type { IntorResolvedConfig } from "../../../../src/intor/core/intor-config/types/define-intor-config-types";
import type { InitRoutingOptions } from "../../../../src/intor/core/intor-config/types/routing-options-types";
import { extractPathname } from "../../../../src/intor/core/utils/pathname/extract-pathname";

const mockConfig = (
  prefix: "none" | "all" | "except-default",
): IntorResolvedConfig =>
  ({
    routing: {
      basePath: "/app",
      prefix,
    } as unknown as Required<InitRoutingOptions>,
    defaultLocale: "en",
    supportedLocales: ["en", "fr", "de"],
  }) as unknown as IntorResolvedConfig;

describe("extractPathname", () => {
  test("removes basePath and extracts locale (prefix: all)", () => {
    const config = mockConfig("all");
    const result = extractPathname({
      config,
      pathname: "/app/fr/about",
    });

    expect(result).toEqual({
      basePath: "/app",
      prefixedPathname: "/fr/about",
      unprefixedPathname: "/about",
      maybeLocale: "fr",
      isLocalePrefixed: true,
    });
  });

  test("keeps unprefixed path when locale is default and prefix is 'except-default'", () => {
    const config = mockConfig("except-default");
    const result = extractPathname({
      config,
      pathname: "/app/en/contact",
    });

    expect(result).toEqual({
      basePath: "/app",
      prefixedPathname: "/en/contact",
      unprefixedPathname: "/en/contact", // no strip because it's default locale
      maybeLocale: "en",
      isLocalePrefixed: true,
    });
  });

  test("removes locale prefix when non-default and prefix is 'except-default'", () => {
    const config = mockConfig("except-default");
    const result = extractPathname({
      config,
      pathname: "/app/de/help",
    });

    expect(result).toEqual({
      basePath: "/app",
      prefixedPathname: "/de/help",
      unprefixedPathname: "/help",
      maybeLocale: "de",
      isLocalePrefixed: true,
    });
  });

  test("handles path without locale prefix when prefix is 'none'", () => {
    const config = mockConfig("none");
    const result = extractPathname({
      config,
      pathname: "/app/about",
    });

    expect(result).toEqual({
      basePath: "/app",
      prefixedPathname: "/about",
      unprefixedPathname: "/about",
      maybeLocale: "about", // first part after slash, but not treated as locale
      isLocalePrefixed: false,
    });
  });

  test("handles basePath only (root)", () => {
    const config = mockConfig("all");
    const result = extractPathname({
      config,
      pathname: "/app",
    });

    expect(result).toEqual({
      basePath: "/app",
      prefixedPathname: "/",
      unprefixedPathname: "/",
      maybeLocale: "",
      isLocalePrefixed: false,
    });
  });
});
