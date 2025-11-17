import type { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import { describe, it, expect } from "vitest";
import { PREFIX_PLACEHOLDER } from "@/shared/constants/prefix-placeholder";
import { resolveNamespaces } from "@/shared/utils";

describe("resolveNamespaces", () => {
  const baseConfig = {
    routing: { basePath: "/" },
    loader: {
      routeNamespaces: {
        default: ["defaultNs"],
        "/exact": ["exactNs"],
        [`/${PREFIX_PLACEHOLDER}/path`]: ["placeholderNs"],
        "/prefix/*": ["prefixNs"],
        "/prefix/long/*": ["longPrefixNs"],
      },
      namespaces: ["fallbackNs"],
    },
  } as unknown as IntorResolvedConfig;

  it("includes default and fallback namespaces", () => {
    const result = resolveNamespaces({
      config: baseConfig,
      pathname: "/unknown",
    });
    expect(result).toEqual(expect.arrayContaining(["defaultNs", "fallbackNs"]));
  });

  it("matches exact pathname", () => {
    const result = resolveNamespaces({
      config: baseConfig,
      pathname: "/exact",
    });
    expect(result).toEqual(
      expect.arrayContaining(["exactNs", "defaultNs", "fallbackNs"]),
    );
  });

  it("matches placeholder pathname", () => {
    const result = resolveNamespaces({
      config: baseConfig,
      pathname: `/${PREFIX_PLACEHOLDER}/path`,
    });
    expect(result).toEqual(
      expect.arrayContaining(["placeholderNs", "defaultNs", "fallbackNs"]),
    );
  });

  it("matches all prefix patterns", () => {
    const result = resolveNamespaces({
      config: baseConfig,
      pathname: "/prefix/long/abc",
    });

    expect(result).toEqual(
      expect.arrayContaining([
        "prefixNs",
        "longPrefixNs",
        "defaultNs",
        "fallbackNs",
      ]),
    );
  });

  it("removes duplicate namespaces", () => {
    const configWithOverlap: IntorResolvedConfig = {
      routing: { basePath: "/" },
      loader: {
        routeNamespaces: {
          default: ["defaultNs"],
          "/dup/*": ["defaultNs", "dupNs"],
        },
        namespaces: ["defaultNs"],
      },
    } as unknown as IntorResolvedConfig;

    const result = resolveNamespaces({
      config: configWithOverlap,
      pathname: "/dup/test",
    });
    const uniqueSet = new Set(result);
    expect(result?.length).toBe(uniqueSet.size);
  });

  it("covers prefix pattern branch for long prefix", () => {
    const config: IntorResolvedConfig = {
      routing: { basePath: "/" },
      loader: {
        routeNamespaces: {
          "/prefix/*": ["prefixNs"],
          "/prefix/long/*": ["longPrefixNs"],
          default: ["defaultNs"],
        },
        namespaces: ["fallbackNs"],
      },
    } as unknown as IntorResolvedConfig;

    const result = resolveNamespaces({
      config,
      pathname: "/prefix/long/test",
    });

    expect(result).toEqual(
      expect.arrayContaining([
        "prefixNs",
        "longPrefixNs",
        "defaultNs",
        "fallbackNs",
      ]),
    );
  });
});
