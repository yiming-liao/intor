/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PathnameContext } from "@/routing/pipeline/resolve-pathname/types";
import { describe, it, expect } from "vitest";
import { all } from "@/routing/pipeline/resolve-pathname/strategies";

describe("all", () => {
  it("passes when URL already has locale prefix", () => {
    const config = { routing: { firstVisit: {} } } as any;
    const context: PathnameContext = {
      localeSource: "path",
      locale: "any",
    };
    expect(all(context, config)).toEqual({
      type: "pass",
    });
  });

  it("redirects using cookie locale when no prefix but cookie exists", () => {
    const config = { routing: { firstVisit: {} } } as any;
    const context: PathnameContext = {
      localeSource: "cookie",
      locale: "any",
    };
    expect(all(context, config)).toEqual({
      type: "redirect",
    });
  });

  it("passes on first visit when redirect is disabled", () => {
    const config = { routing: { firstVisit: { redirect: false } } } as any;
    const context: PathnameContext = {
      localeSource: "detected",
      locale: "any",
    };
    expect(all(context, config)).toEqual({
      type: "pass",
    });
  });

  it("redirects on first visit when redirect is enabled", () => {
    const config = { routing: { firstVisit: { redirect: true } } } as any;
    const context: PathnameContext = {
      localeSource: "detected",
      locale: "any",
    };
    expect(all(context, config)).toEqual({
      type: "redirect",
    });
  });
});
