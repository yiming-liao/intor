import { DEFAULT_CACHE_OPTIONS } from "@/modules/config/constants/cache.constants";
import {
  CacheRawOptions,
  CacheResolvedOptions,
} from "@/modules/config/types/cache.types";

export const resolveCacheOptions = (
  cache?: CacheRawOptions,
): CacheResolvedOptions => {
  return {
    ...DEFAULT_CACHE_OPTIONS,
    ...cache,
  };
};
