import { DEFAULT_ROUTING_OPTIONS } from "@/modules/intor-config/constants/routing-options-constants";
import { resolveRoutingOptions } from "@/modules/intor-config/resolvers/resolve-routing-options";
import { InitRoutingOptions } from "@/modules/intor-config/types/routing-options-types";

describe("resolveRoutingOptions", () => {
  it("should return default routing options if no input is provided", () => {
    expect(resolveRoutingOptions()).toEqual({
      ...DEFAULT_ROUTING_OPTIONS,
      firstVisit: { ...DEFAULT_ROUTING_OPTIONS.firstVisit },
    });
  });

  it("should merge custom routing options correctly", () => {
    const custom: InitRoutingOptions = {
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
