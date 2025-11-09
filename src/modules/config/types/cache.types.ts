// Cache raw options
export type CacheRawOptions = {
  enabled?: boolean;
  /** default: 60\*60\*1000 (1 hour) */
  ttl?: number;
};

// Cache resolved options
export type CacheResolvedOptions = Required<CacheRawOptions>;
