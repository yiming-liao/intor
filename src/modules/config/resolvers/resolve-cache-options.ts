import type {
  CacheRawOptions,
  CacheResolvedOptions,
} from "@/modules/config/types/cache.types";
import { DEFAULT_CACHE_OPTIONS } from "@/modules/config/constants/cache.constants";

export const resolveCacheOptions = (
  cache?: CacheRawOptions,
): CacheResolvedOptions => {
  return {
    ...DEFAULT_CACHE_OPTIONS,
    ...cache,
  };
};
