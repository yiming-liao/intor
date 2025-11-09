import { DEFAULT_ROUTING_OPTIONS } from "@/modules/config/constants/routing.constants";
import { resolveRoutingOptions } from "@/modules/config/resolvers/resolve-routing-options";
import { RoutingRawOptions } from "@/modules/config/types/routing.types";

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
