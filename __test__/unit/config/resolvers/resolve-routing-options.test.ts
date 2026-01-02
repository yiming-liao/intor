import type { RoutingRawOptions } from "@/config/types/routing";
import { describe, it, expect } from "vitest";
import { DEFAULT_ROUTING_OPTIONS } from "@/config";
import { resolveRoutingOptions } from "@/config/resolvers/resolve-routing-options";

describe("resolveRoutingOptions", () => {
  it("returns a fully resolved routing config with defaults when no input is provided", () => {
    const resolved = resolveRoutingOptions();
    expect(resolved).toEqual({
      ...DEFAULT_ROUTING_OPTIONS,
      // ensure nested objects are not shared by reference
      locale: { ...DEFAULT_ROUTING_OPTIONS.locale },
      navigation: {
        ...DEFAULT_ROUTING_OPTIONS.navigation,
        path: { ...DEFAULT_ROUTING_OPTIONS.navigation.path },
        query: { ...DEFAULT_ROUTING_OPTIONS.navigation.query },
        host: { ...DEFAULT_ROUTING_OPTIONS.navigation.host },
      },
      firstVisit: { ...DEFAULT_ROUTING_OPTIONS.firstVisit },
    });
  });

  it("merges partial navigation options without dropping defaults", () => {
    const custom: RoutingRawOptions = {
      navigation: {
        path: { prefix: "all" },
      },
    };
    const resolved = resolveRoutingOptions(custom);
    expect(resolved.navigation).toEqual({
      carrier: DEFAULT_ROUTING_OPTIONS.navigation.carrier,
      path: { prefix: "all" }, // overridden
      query: DEFAULT_ROUTING_OPTIONS.navigation.query, // preserved
      host: DEFAULT_ROUTING_OPTIONS.navigation.host, // preserved
    });
  });

  it("merges locale options correctly", () => {
    const custom: RoutingRawOptions = {
      locale: {
        sources: ["cookie"],
        query: { key: "lang" },
      },
    };
    const resolved = resolveRoutingOptions(custom);
    expect(resolved.locale).toEqual({
      sources: ["cookie"],
      query: { key: "lang" },
    });
  });

  it("normalizes basePath during resolution", () => {
    const custom: RoutingRawOptions = {
      basePath: "",
    };
    const resolved = resolveRoutingOptions(custom);
    expect(resolved.basePath).toBe("/");
  });

  it("merges firstVisit options partially", () => {
    const custom: RoutingRawOptions = {
      firstVisit: {
        redirect: false,
      },
    };
    const resolved = resolveRoutingOptions(custom);
    expect(resolved.firstVisit).toEqual({
      localeSource: DEFAULT_ROUTING_OPTIONS.firstVisit.localeSource,
      redirect: false,
      persist: DEFAULT_ROUTING_OPTIONS.firstVisit.persist,
    });
  });
});
