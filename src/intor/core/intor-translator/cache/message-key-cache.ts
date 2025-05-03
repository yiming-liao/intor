import { Cache } from "@/intor/core/intor-translator/cache";

export const MESSAGE_KEY_CACHE_MAX_SIZE = 100;
export const MESSAGE_KEY_CACHE_EXPIRES_TIME = 1000 * 60 * 5;

/**
 * Initialize cache only on client-side (CSR).
 *
 * Why CSR?
 * - Prevent SSR/CSR hydration mismatches.
 * - Keep data in browser memory.
 */
export let messageKeyCache: Cache | undefined;

if (typeof window !== "undefined") {
  messageKeyCache = new Cache(
    MESSAGE_KEY_CACHE_MAX_SIZE,
    MESSAGE_KEY_CACHE_EXPIRES_TIME,
  );
}

// For testing
export const setCacheForTest = () => {
  if (!messageKeyCache) {
    messageKeyCache = new Cache(
      MESSAGE_KEY_CACHE_MAX_SIZE,
      MESSAGE_KEY_CACHE_EXPIRES_TIME,
    );
  }
};
