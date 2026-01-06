import type { IntorResolvedConfig } from "@/config";
import type { PathnameContext } from "@/routing/inbound/resolve-pathname/types";
import { describe, it, expect } from "vitest";
import { all } from "@/routing/inbound/resolve-pathname/strategies";

function createConfig(redirect?: boolean): IntorResolvedConfig {
  return {
    defaultLocale: "en",
    routing: { inbound: { firstVisit: { redirect } } },
  } as IntorResolvedConfig;
}

function createContext(overrides?: Partial<PathnameContext>): PathnameContext {
  return {
    locale: "zh-TW",
    hasPathLocale: false,
    hasPersisted: true,
    hasRedirected: false,
    ...overrides,
  };
}

describe("routing prefix strategy: all", () => {
  it("passes when URL already has locale prefix", () => {
    const context = createContext({ hasPathLocale: true });
    const config = createConfig();
    expect(all(config, context)).toEqual({ type: "pass" });
  });

  it("passes when already redirected in the same navigation flow", () => {
    const context = createContext({ hasRedirected: true });
    const config = createConfig();
    expect(all(config, context)).toEqual({ type: "pass" });
  });

  it("passes on first visit when redirect is disabled", () => {
    const context = createContext({ hasPersisted: false });
    const config = createConfig(false);
    expect(all(config, context)).toEqual({ type: "pass" });
  });

  it("redirects on first visit when redirect is enabled", () => {
    const context = createContext({ hasPersisted: false });
    const config = createConfig(true);
    expect(all(config, context)).toEqual({ type: "redirect" });
  });

  it("redirects returning users without locale prefix", () => {
    const context = createContext();
    const config = createConfig(true);
    expect(all(config, context)).toEqual({ type: "redirect" });
  });
});
