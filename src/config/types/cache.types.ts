// Cache raw options
export type CacheRawOptions = {
  /** default: process.env.NODE_ENV === "production" */
  enabled?: boolean;
  /** default: 60\*60\*1000 (1 hour) */
  ttl?: number;
};

// Cache resolved options
export type CacheResolvedOptions = Required<CacheRawOptions>;
