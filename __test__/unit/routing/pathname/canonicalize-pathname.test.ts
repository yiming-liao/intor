/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "@/config";
import { describe, it, expect } from "vitest";
import { canonicalizePathname } from "@/routing/pathname/canonicalize-pathname";

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

describe("canonicalizePathname", () => {
  it("normalizes the pathname", () => {
    const config = createConfig();
    const result = canonicalizePathname("///about///", config);
    expect(result).toBe("/about");
  });

  it("strips basePath from pathname", () => {
    const config = createConfig({
      routing: {
        basePath: "/app",
        prefix: "all",
      } as any,
    });
    const result = canonicalizePathname("/app/about", config);
    expect(result).toBe("/about");
  });

  it("returns '/' when pathname equals basePath", () => {
    const config = createConfig({
      routing: {
        basePath: "/app",
        prefix: "all",
      } as any,
    });
    const result = canonicalizePathname("/app", config);
    expect(result).toBe("/");
  });

  it("detects and strips leading locale segment", () => {
    const config = createConfig();
    const result = canonicalizePathname("/en-US/about", config);
    expect(result).toBe("/about");
  });

  it("strips both basePath and locale segment", () => {
    const config = createConfig({
      routing: {
        basePath: "/app",
        prefix: "all",
      } as any,
    });
    const result = canonicalizePathname("/app/zh-TW/about", config);
    expect(result).toBe("/about");
  });

  it("returns '/' when only locale segment is present", () => {
    const config = createConfig();
    const result = canonicalizePathname("/en-US", config);
    expect(result).toBe("/");
  });

  it("does not strip unsupported locale-like segment", () => {
    const config = createConfig();
    const result = canonicalizePathname("/fr/about", config);
    expect(result).toBe("/fr/about");
  });

  it("detects and strips locale placeholder segment", () => {
    const config = createConfig();
    const result = canonicalizePathname("/{locale}/about", config);
    expect(result).toBe("/about");
  });

  it("strips both basePath and locale placeholder segment", () => {
    const config = createConfig({
      routing: {
        basePath: "/app",
        prefix: "all",
      } as any,
    });
    const result = canonicalizePathname("/app/{locale}/about", config);
    expect(result).toBe("/about");
  });

  it("returns '/' when only locale placeholder is present", () => {
    const config = createConfig();
    const result = canonicalizePathname("/{locale}", config);
    expect(result).toBe("/");
  });

  it("does not strip placeholder-like segment if it is not the locale placeholder", () => {
    const config = createConfig();
    const result = canonicalizePathname("/{lang}/about", config);
    expect(result).toBe("/{lang}/about");
  });

  it("does not strip locale placeholder if it is not the first segment", () => {
    const config = createConfig();
    const result = canonicalizePathname("/about/{locale}", config);
    expect(result).toBe("/about/{locale}");
  });
});
