import type { InitRoutingOptions } from "../../../../src/intor/core/intor-config/types/routing-options-types";
import { DEFAULT_ROUTING_OPTIONS } from "../../../../src/intor/constants/routing-options-constants";
import { resolveRoutingOptions } from "../../../../src/intor/core/intor-config/resolvers/resolve-routing-options";

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
