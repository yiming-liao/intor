import type { CacheRawOptions, CacheResolvedOptions } from "../types";
import { DEFAULT_CACHE_OPTIONS } from "../constants";

export const resolveCacheOptions = (
  cache?: CacheRawOptions,
): CacheResolvedOptions => {
  return {
    ...DEFAULT_CACHE_OPTIONS,
    ...cache,
  };
};
