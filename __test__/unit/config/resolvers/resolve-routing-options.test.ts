import type { RoutingRawOptions } from "@/config/types/routing.types";
import { describe, it, expect } from "vitest";
import { DEFAULT_ROUTING_OPTIONS } from "@/config/constants/routing.constants";
import { resolveRoutingOptions } from "@/config/resolvers/resolve-routing-options";

describe("resolveRoutingOptions", () => {
  it("should return default routing options if no input is provided", () => {
    expect(resolveRoutingOptions()).toEqual({
      ...DEFAULT_ROUTING_OPTIONS,
      firstVisit: { ...DEFAULT_ROUTING_OPTIONS.firstVisit },
    });
  });

  it("should merge custom routing options correctly", () => {
    const custom: RoutingRawOptions = {
      prefix: "all",
      basePath: "",
    };

    expect(resolveRoutingOptions(custom)).toEqual({
      ...DEFAULT_ROUTING_OPTIONS,
      ...custom,
      firstVisit: {
        ...DEFAULT_ROUTING_OPTIONS.firstVisit,
        ...custom.firstVisit,
      },
      basePath: "/",
    });
  });
});
