/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "@/config";
import { describe, it, expect } from "vitest";
import { getUnprefixedPathname } from "@/core/utils/pathname/get-unprefixed-pathname";

const createConfig = (
  overrides?: Partial<IntorResolvedConfig>,
): IntorResolvedConfig =>
  ({
    supportedLocales: ["en-US", "zh-TW"],
    routing: {
      basePath: "",
      prefix: "all",
    },
    ...overrides,
  }) as IntorResolvedConfig;

describe("getUnprefixedPathname", () => {
  it("normalizes the pathname", () => {
    const config = createConfig();
    const result = getUnprefixedPathname(config, "///about///");
    expect(result).toBe("/about");
  });

  it("strips basePath from pathname", () => {
    const config = createConfig({
      routing: {
        basePath: "/app",
        prefix: "all",
      } as any,
    });
    const result = getUnprefixedPathname(config, "/app/about");
    expect(result).toBe("/about");
  });

  it("returns '/' when pathname equals basePath", () => {
    const config = createConfig({
      routing: {
        basePath: "/app",
        prefix: "all",
      } as any,
    });
    const result = getUnprefixedPathname(config, "/app");
    expect(result).toBe("/");
  });

  it("detects and strips leading locale segment", () => {
    const config = createConfig();
    const result = getUnprefixedPathname(config, "/en-US/about");
    expect(result).toBe("/about");
  });

  it("strips both basePath and locale segment", () => {
    const config = createConfig({
      routing: {
        basePath: "/app",
        prefix: "all",
      } as any,
    });
    const result = getUnprefixedPathname(config, "/app/zh-TW/about");
    expect(result).toBe("/about");
  });

  it("returns '/' when only locale segment is present", () => {
    const config = createConfig();
    const result = getUnprefixedPathname(config, "/en-US");
    expect(result).toBe("/");
  });

  it("does not strip unsupported locale-like segment", () => {
    const config = createConfig();
    const result = getUnprefixedPathname(config, "/fr/about");
    expect(result).toBe("/fr/about");
  });
});
