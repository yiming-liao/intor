/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PathnameContext } from "@/routing/pathname/types";
import { describe, it, expect } from "vitest";
import { exceptDefault } from "@/routing/pathname/strategies/except-default";

describe("exceptDefault", () => {
  it("passes when URL already has locale prefix", () => {
    const config = { routing: { firstVisit: {} } } as any;
    const context: PathnameContext = {
      localeSource: "path",
      locale: "any",
    };
    expect(exceptDefault(context, config)).toEqual({
      type: "pass",
    });
  });

  it("passes when no prefix and cookie locale is default", () => {
    const config = {
      routing: { firstVisit: {} },
      defaultLocale: "en-US",
    } as any;
    const context: PathnameContext = {
      localeSource: "cookie",
      locale: "en-US",
    };
    expect(exceptDefault(context, config)).toEqual({
      type: "pass",
    });
  });

  it("redirects when no prefix and cookie locale is not default", () => {
    const config = { routing: { firstVisit: {} } } as any;
    const context: PathnameContext = {
      localeSource: "cookie",
      locale: "en-US",
    };
    expect(exceptDefault(context, config)).toEqual({
      type: "redirect",
    });
  });

  it("passes on first visit when redirect is disabled", () => {
    const config = { routing: { firstVisit: { redirect: false } } } as any;
    const context: PathnameContext = {
      localeSource: "detected",
      locale: "en-US",
    };
    expect(exceptDefault(context, config)).toEqual({
      type: "pass",
    });
  });

  it("passes on first visit when detected locale is default", () => {
    const config = {
      routing: { firstVisit: { redirect: true } },
      defaultLocale: "en-US",
    } as any;
    const context: PathnameContext = {
      localeSource: "detected",
      locale: "en-US",
    };
    expect(exceptDefault(context, config)).toEqual({
      type: "pass",
    });
  });

  it("redirects on first visit when detected locale is not default", () => {
    const config = {
      routing: { firstVisit: { redirect: true } },
      defaultLocale: "en-US",
    } as any;
    const context: PathnameContext = {
      localeSource: "detected",
      locale: "fr-FR",
    };
    expect(exceptDefault(context, config)).toEqual({
      type: "redirect",
    });
  });
});
