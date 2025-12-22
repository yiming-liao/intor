import type { PathnameContext } from "@/routing/pathname/types";
import { describe, it, expect } from "vitest";
import { none } from "@/routing/pathname/strategies/none";

describe("none", () => {
  it("passes using cookie locale when cookie exists", () => {
    const context: PathnameContext = {
      localeSource: "cookie",
      locale: "any",
    };
    expect(none(context)).toEqual({
      type: "pass",
    });
  });

  it("passes using detected locale when no cookie exists", () => {
    const context: PathnameContext = {
      localeSource: "detected",
      locale: "any",
    };
    expect(none(context)).toEqual({
      type: "pass",
    });
  });
});
