/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "../../../../src/config";
import { describe, it, expect } from "vitest";
import { canonicalizePathname } from "../../../../src/routing/pathname/canonicalize-pathname";

const createConfig = (
  overrides?: Partial<IntorResolvedConfig>,
): IntorResolvedConfig =>
  ({
    supportedLocales: ["en", "zh"],
    routing: {
      basePath: "",
      prefix: "all",
    },
    ...overrides,
  }) as IntorResolvedConfig;

describe("canonicalizePathname", () => {
  it("normalizes pathname", () => {
    const config = createConfig();
    expect(canonicalizePathname("///about///", config)).toBe("/about");
  });

  it("returns '/' for root pathname", () => {
    const config = createConfig();
    expect(canonicalizePathname("/", config)).toBe("/");
  });

  it("strips basePath", () => {
    const config = createConfig({
      routing: { basePath: "/app", prefix: "all" } as any,
    });
    expect(canonicalizePathname("/app/about", config)).toBe("/about");
    expect(canonicalizePathname("/app", config)).toBe("/");
    expect(canonicalizePathname("/app/", config)).toBe("/");
  });

  it("does not strip basePath on partial match", () => {
    const config = createConfig({
      routing: { basePath: "/app", prefix: "all" } as any,
    });
    expect(canonicalizePathname("/app2/about", config)).toBe("/app2/about");
  });

  it("treats basePath '/' as no basePath", () => {
    const config = createConfig({
      routing: { basePath: "/", prefix: "all" } as any,
    });
    expect(canonicalizePathname("/en/about", config)).toBe("/about");
  });

  it("strips supported locale segment", () => {
    const config = createConfig();
    expect(canonicalizePathname("/en/about", config)).toBe("/about");
    expect(canonicalizePathname("/en", config)).toBe("/");
  });

  it("does not strip unsupported locale-like segment", () => {
    const config = createConfig();
    expect(canonicalizePathname("/fr/about", config)).toBe("/fr/about");
  });

  it("strips locale placeholder segment", () => {
    const config = createConfig();
    expect(canonicalizePathname("/{locale}/about", config)).toBe("/about");
    expect(canonicalizePathname("/{locale}", config)).toBe("/");
  });

  it("does not strip placeholder if not first segment", () => {
    const config = createConfig();
    expect(canonicalizePathname("/about/{locale}", config)).toBe(
      "/about/{locale}",
    );
    expect(canonicalizePathname("/{lang}/about", config)).toBe("/{lang}/about");
  });

  it("strips both basePath and locale/placeholder", () => {
    const config = createConfig({
      routing: { basePath: "/app", prefix: "all" } as any,
    });
    expect(canonicalizePathname("/app/zh/about", config)).toBe("/about");
    expect(canonicalizePathname("/app/{locale}/about", config)).toBe("/about");
  });
});
