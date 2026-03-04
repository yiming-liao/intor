import type { IntorResolvedConfig } from "../../../../../../src/config";
import type { PathContext } from "../../../../../../src/routing/inbound/resolve-pathname/types";
import { describe, it, expect } from "vitest";
import { exceptDefault } from "../../../../../../src/routing/inbound/resolve-pathname/strategies";

function createConfig(
  defaultLocale = "en-US",
  redirect?: boolean,
): IntorResolvedConfig {
  return {
    defaultLocale,
    routing: { inbound: { firstVisit: { redirect } } },
  } as IntorResolvedConfig;
}

function createContext(overrides: Partial<PathContext>): PathContext {
  return {
    locale: "zh-TW",
    hasPathLocale: false,
    hasPersisted: true,
    hasRedirected: false,
    ...overrides,
  };
}

describe("routing prefix strategy: except-default", () => {
  it("passes when URL already has locale prefix", () => {
    const context = createContext({ hasPathLocale: true });
    const config = createConfig();
    expect(exceptDefault(config, context)).toEqual({ type: "pass" });
  });

  it("passes when already redirected in the same navigation flow", () => {
    const context = createContext({ hasRedirected: true });
    const config = createConfig();
    expect(exceptDefault(config, context)).toEqual({ type: "pass" });
  });

  it("passes on first visit when redirect is disabled", () => {
    const context = createContext({ hasPersisted: false });
    const config = createConfig("en-US", false);
    expect(exceptDefault(config, context)).toEqual({ type: "pass" });
  });

  it("passes on first visit when locale is default", () => {
    const context = createContext({ hasPersisted: false, locale: "en-US" });
    const config = createConfig("en-US", true);
    expect(exceptDefault(config, context)).toEqual({ type: "pass" });
  });

  it("redirects on first visit when locale is not default", () => {
    const context = createContext({ hasPersisted: false, locale: "fr-FR" });
    const config = createConfig("en-US", true);
    expect(exceptDefault(config, context)).toEqual({ type: "redirect" });
  });

  it("redirects returning users when locale is not default", () => {
    const context = createContext({ locale: "fr-FR" });
    const config = createConfig("en-US", true);
    expect(exceptDefault(config, context)).toEqual({ type: "redirect" });
  });

  it("passes returning users when locale is default", () => {
    const context = createContext({ locale: "en-US" });
    const config = createConfig("en-US", true);
    expect(exceptDefault(config, context)).toEqual({ type: "pass" });
  });
});
