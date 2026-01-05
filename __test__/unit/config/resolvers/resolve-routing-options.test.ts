import { describe, it, expect } from "vitest";
import { DEFAULT_ROUTING_OPTIONS } from "@/config/constants";
import { resolveRoutingOptions } from "@/config/resolvers/resolve-routing-options";

describe("resolveRoutingOptions", () => {
  it("returns default routing options when raw is undefined", () => {
    const resolved = resolveRoutingOptions();
    expect(resolved).toEqual(DEFAULT_ROUTING_OPTIONS);
  });

  it("projects flat shortcuts into structured options", () => {
    const resolved = resolveRoutingOptions({
      localePrefix: "none",
      queryKey: "lang",
      forceFullReload: true,
    });
    expect(resolved.localePrefix).toBe("none"); // projected to inbound
    expect(resolved.inbound.queryKey).toBe("lang"); // projected to outbound
    expect(resolved.outbound.queryKey).toBe("lang");
    expect(resolved.outbound.forceFullReload).toBe(true);
  });

  it("allows structured options to override projected flat values", () => {
    const resolved = resolveRoutingOptions({
      queryKey: "lang",
      outbound: {
        queryKey: "locale",
      },
    });
    expect(resolved.inbound.queryKey).toBe("lang");
    expect(resolved.outbound.queryKey).toBe("locale");
  });

  it("merges structured inbound options correctly", () => {
    const resolved = resolveRoutingOptions({
      inbound: {
        localeSources: ["cookie"],
        firstVisit: {
          localeSource: "browser",
          redirect: false,
          persist: true,
        },
      },
    });
    expect(resolved.inbound.localeSources).toEqual(["cookie"]);
    expect(resolved.inbound.firstVisit.localeSource).toBe("browser");
    expect(resolved.inbound.firstVisit.redirect).toBe(false);
    expect(resolved.inbound.firstVisit.persist).toBe(true);
  });

  it("merges structured outbound options correctly", () => {
    const resolved = resolveRoutingOptions({
      outbound: {
        localeCarrier: "path",
        forceFullReload: true,
      },
    });
    expect(resolved.outbound.localeCarrier).toBe("path");
    expect(resolved.outbound.forceFullReload).toBe(true);
  });

  it("supports mixing flat shortcuts with structured options", () => {
    const resolved = resolveRoutingOptions({
      localePrefix: "except-default",
      forceFullReload: true,
      outbound: {
        localeCarrier: "host",
      },
    });
    expect(resolved.localePrefix).toBe("except-default");
    expect(resolved.outbound.forceFullReload).toBe(true);
    expect(resolved.outbound.localeCarrier).toBe("host");
  });

  it("does not leak flat shortcuts into resolved output", () => {
    const resolved = resolveRoutingOptions({
      queryKey: "lang",
      forceFullReload: true,
    }) as Record<string, unknown>;
    expect(resolved.queryKey).toBeUndefined();
    expect(resolved.forceFullReload).toBeUndefined();
  });

  it("overrides default basePath when basePath is provided in raw options", () => {
    const resolved = resolveRoutingOptions({ basePath: "/app" });
    expect(resolved.basePath).toBe("/app");
  });
});
