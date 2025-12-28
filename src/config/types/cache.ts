// Cache raw options
export type CacheRawOptions = {
  /** Enable cache behavior. Defaults to production */
  enabled?: boolean;
  /** Cache time-to-live in milliseconds. Defaults to 1 hour */
  ttl?: number;
};

// Cache resolved options
export type CacheResolvedOptions = Required<CacheRawOptions>;
