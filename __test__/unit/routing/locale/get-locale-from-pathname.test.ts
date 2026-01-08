/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "@/config";
import { describe, it, expect } from "vitest";
import { getLocaleFromPathname } from "@/routing";

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

describe("getLocaleFromPathname", () => {
  it("detects locale from the first pathname segment", () => {
    const config = createConfig();
    const result = getLocaleFromPathname("/en-US/about", config);
    expect(result).toBe("en-US");
  });

  it("returns undefined when no locale segment is present", () => {
    const config = createConfig();
    const result = getLocaleFromPathname("/about", config);
    expect(result).toBeUndefined();
  });

  it("does not treat unsupported locale-like segment as locale", () => {
    const config = createConfig();
    const result = getLocaleFromPathname("/fr/about", config);
    expect(result).toBeUndefined();
  });

  it("strips basePath before detecting locale", () => {
    const config = createConfig({
      routing: {
        basePath: "/app",
        prefix: "all",
      } as any,
    });
    const result = getLocaleFromPathname("/app/zh-TW/about", config);
    expect(result).toBe("zh-TW");
  });

  it("returns undefined when pathname equals basePath", () => {
    const config = createConfig({
      routing: {
        basePath: "/app",
        prefix: "all",
      } as any,
    });
    const result = getLocaleFromPathname("/app", config);
    expect(result).toBeUndefined();
  });

  it("returns locale when pathname is only locale after basePath", () => {
    const config = createConfig({
      routing: {
        basePath: "/app",
        prefix: "all",
      } as any,
    });
    const result = getLocaleFromPathname("/app/en-US", config);
    expect(result).toBe("en-US");
  });
});
