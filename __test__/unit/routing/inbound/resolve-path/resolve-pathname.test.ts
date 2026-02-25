import type { IntorResolvedConfig } from "../../../../../src/config";
import type { PathContext } from "../../../../../src/routing/inbound/resolve-path/types";
import { describe, it, expect, vi } from "vitest";
import { resolvePath } from "../../../../../src/routing/inbound/resolve-path/resolve-path";

vi.mock("../../../../../src/routing/pathname", () => ({
  localizePathname: (pathname: string) => ({ pathname }),
}));

const createConfig = (
  prefix: "all" | "except-default" | "none",
  options?: { defaultLocale?: string; redirect?: boolean },
): IntorResolvedConfig =>
  ({
    defaultLocale: options?.defaultLocale ?? "en-US",
    routing: {
      localePrefix: prefix,
      inbound: { firstVisit: { redirect: options?.redirect } },
    },
  }) as IntorResolvedConfig;

const createContext = (overrides?: Partial<PathContext>): PathContext => ({
  locale: "en-US",
  hasPathLocale: false,
  hasPersisted: false,
  hasRedirected: false,
  ...overrides,
});

describe("resolvePathname (decision only)", () => {
  it("passes when prefix strategy is 'none'", () => {
    const config = createConfig("none");
    const context = createContext();
    const result = resolvePath(config, "/about", context);
    expect(result).toEqual({ pathname: "/about", shouldRedirect: false });
  });

  it("redirects when prefix is 'all' and URL is not canonical", () => {
    const config = createConfig("all", { redirect: true });
    const context = createContext();
    const result = resolvePath(config, "/about", context);
    expect(result.pathname).toBe("/about");
    expect(result.shouldRedirect).toBe(true);
  });

  it("does not redirect when prefix is 'all' and URL already has locale prefix", () => {
    const config = createConfig("all", { redirect: true });
    const context = createContext({ hasPathLocale: true });
    const result = resolvePath(config, "/en-US/about", context);
    expect(result).toEqual({ pathname: "/en-US/about", shouldRedirect: false });
  });

  it("redirects for 'except-default' when locale is non-default (returning visitor)", () => {
    const config = createConfig("except-default", { defaultLocale: "en-US" });
    const context = createContext({ locale: "fr-FR", hasPersisted: true });
    const result = resolvePath(config, "/about", context);
    expect(result.shouldRedirect).toBe(true);
  });

  it("does not redirect for 'except-default' when locale is default", () => {
    const config = createConfig("except-default", { defaultLocale: "en-US" });
    const context = createContext({ locale: "en-US" });
    const result = resolvePath(config, "/about", context);
    expect(result).toEqual({ pathname: "/about", shouldRedirect: false });
  });

  it("does not redirect again when already redirected in this flow", () => {
    const config = createConfig("all", { redirect: true });
    const context = createContext({ hasRedirected: true });
    const result = resolvePath(config, "/about", context);
    expect(result).toEqual({ pathname: "/about", shouldRedirect: false });
  });
});
