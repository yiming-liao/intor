import type { CacheRawOptions } from "@/modules/config/types/cache.types";
import { describe, it, expect } from "vitest";
import { DEFAULT_CACHE_OPTIONS } from "@/modules/config/constants/cache.constants";
import { resolveCacheOptions } from "@/modules/config/resolvers/resolve-cache-options";

describe("resolveCacheOptions", () => {
  it("returns default options when no cache is provided", () => {
    const result = resolveCacheOptions();
    expect(result).toEqual(DEFAULT_CACHE_OPTIONS);
  });

  it("overrides default options with provided values", () => {
    const customOptions = {
      enabled: false,
      maxAge: 5000,
      storage: "memory" as const,
    };

    const result = resolveCacheOptions(customOptions);
    expect(result).toEqual({
      ...DEFAULT_CACHE_OPTIONS,
      ...customOptions,
    });
  });

  it("merges partially provided options", () => {
    const partialOptions = {
      maxAge: 10_000,
    };

    const result = resolveCacheOptions(partialOptions as CacheRawOptions);
    expect(result).toEqual({
      ...DEFAULT_CACHE_OPTIONS,
      maxAge: 10_000,
    });
  });

  it("preserves default values if not overridden", () => {
    const partialOptions = {
      enabled: true,
    };

    const result = resolveCacheOptions(partialOptions);
    expect(result).toEqual({
      ...DEFAULT_CACHE_OPTIONS,
      enabled: true,
    });
  });
});
