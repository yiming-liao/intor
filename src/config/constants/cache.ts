import type { CacheResolvedOptions } from "../types";

// Default cache options
export const DEFAULT_CACHE_OPTIONS: CacheResolvedOptions = {
  enabled: process.env.NODE_ENV === "production",
  ttl: 60 * 60 * 1000, // 1 hour
};
