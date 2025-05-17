export class IntorCache<T = unknown> {
  private cache: Map<string, { value: T; timestamp: number }> = new Map();
  private maxSize: number;
  private ttl: number;

  constructor(maxSize: number = 100, ttl: number = 1000 * 60 * 5) {
    this.maxSize = maxSize; // default maxSize to 100
    this.ttl = ttl; // default ttl to 5 minutes
  }

  // Clean up expired cache entries
  private cleanUp() {
    const now = Date.now();
    this.cache.forEach((entry, key) => {
      // Remove expired entries
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    });
  }

  // Get cache data
  get(key: string): T | undefined {
    this.cleanUp();
    const entry = this.cache.get(key);
    if (entry) {
      entry.timestamp = Date.now(); // Update timestamp to refresh TTL
      return entry.value;
    }
    return undefined;
  }

  // Set cache data
  set(key: string, value: T) {
    // Clean up before setting new value
    this.cleanUp();

    // Check if cache size exceeds maxSize and remove the oldest entry if needed
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value; // Get the first key (oldest)
      if (oldestKey) this.cache.delete(oldestKey); // Remove the oldest cache entry
    }

    // Set the new cache entry
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  // Check if a key exists in the cache
  has(key: string): boolean {
    this.cleanUp();
    return this.cache.has(key);
  }

  // Delete a specific cache item by key
  delete(key: string): boolean {
    this.cleanUp();
    return this.cache.delete(key); // Returns true if the item was deleted
  }

  // Clear all cache
  clear() {
    this.cache.clear();
  }

  // Export all cache entries for testing purposes
  exportCache(): Map<string, { value: T; timestamp: number }> {
    this.cleanUp();
    return new Map(this.cache); // Returns a shallow copy of the cache
  }
}
