import type { IntorResolvedConfig } from "@/config";
import type { PathnameContext } from "@/routing/pathname/types";
import { describe, it, expect, vi } from "vitest";
import { resolvePathname } from "@/routing/pathname/resolve-pathname";

/**
 * Mock pathname localization.
 * Always return the original pathname unchanged.
 */
vi.mock("@/core/utils", () => ({
  localizePathname: (_config: unknown, pathname: string) => ({
    localizedPathname: pathname,
  }),
}));

const createConfig = (
  prefix: "all" | "except-default" | "none",
  options?: { defaultLocale?: string; redirect?: boolean },
): IntorResolvedConfig =>
  ({
    defaultLocale: options?.defaultLocale ?? "en-US",
    routing: { prefix, firstVisit: { redirect: options?.redirect } },
  }) as IntorResolvedConfig;

const createContext = (
  partial?: Partial<PathnameContext>,
): PathnameContext => ({
  locale: "en-US",
  localeSource: "detected",
  ...partial,
});

describe("resolvePathname (decision only)", () => {
  it("passes when prefix strategy is 'none'", () => {
    const config = createConfig("none");
    const context = createContext();
    const result = resolvePathname(config, "/about", context);
    expect(result).toEqual({
      pathname: "/about",
      shouldRedirect: false,
    });
  });

  it("redirects when prefix is 'all' and locale is not from path", () => {
    const config = createConfig("all", { redirect: true });
    const context = createContext({ localeSource: "cookie" });
    const result = resolvePathname(config, "/about", context);
    expect(result.pathname).toBe("/about");
    expect(result.shouldRedirect).toBe(true);
  });

  it("does not redirect when prefix is 'all' and locale comes from path", () => {
    const config = createConfig("all", { redirect: true });
    const context = createContext({ localeSource: "path" });
    const result = resolvePathname(config, "/en-US/about", context);
    expect(result).toEqual({
      pathname: "/en-US/about",
      shouldRedirect: false,
    });
  });

  it("redirects for 'except-default' when locale is non-default and from cookie", () => {
    const config = createConfig("except-default", {
      defaultLocale: "en-US",
    });
    const context = createContext({
      locale: "fr-FR",
      localeSource: "cookie",
    });
    const result = resolvePathname(config, "/about", context);
    expect(result.pathname).toBe("/about");
    expect(result.shouldRedirect).toBe(true);
  });

  it("does not redirect for 'except-default' when locale is default", () => {
    const config = createConfig("except-default", {
      defaultLocale: "en-US",
    });
    const context = createContext({
      locale: "en-US",
    });
    const result = resolvePathname(config, "/about", context);
    expect(result).toEqual({
      pathname: "/about",
      shouldRedirect: false,
    });
  });
});
