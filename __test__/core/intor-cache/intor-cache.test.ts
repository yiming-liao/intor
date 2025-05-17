import { IntorCache } from "../../../src/intor/core/intor-cache";

jest.useFakeTimers();

describe("IntorCache", () => {
  let cache: IntorCache<string>;

  beforeEach(() => {
    cache = new IntorCache<string>(3, 1000); // maxSize 3, ttl 1秒
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("should set and get cache values", () => {
    cache.set("key1", "value1");
    expect(cache.get("key1")).toBe("value1");
  });

  it("should return undefined for expired cache", () => {
    cache.set("key1", "value1");
    jest.advanceTimersByTime(1500); // 時間超過 TTL 1秒半
    expect(cache.get("key1")).toBeUndefined();
  });

  it("should refresh TTL on get", () => {
    cache.set("key1", "value1");
    jest.advanceTimersByTime(700); // 等 0.7秒
    expect(cache.get("key1")).toBe("value1"); // 讀取時刷新時間戳
    jest.advanceTimersByTime(700); // 再等 0.7秒（總共1.4秒）
    expect(cache.get("key1")).toBe("value1"); // 不會過期，因為有刷新TTL
  });

  it("should remove oldest entry when maxSize exceeded", () => {
    cache.set("key1", "value1");
    cache.set("key2", "value2");
    cache.set("key3", "value3");

    // 當超過 maxSize，應該移除最舊的 key1
    cache.set("key4", "value4");

    expect(cache.get("key1")).toBeUndefined();
    expect(cache.get("key2")).toBe("value2");
    expect(cache.get("key3")).toBe("value3");
    expect(cache.get("key4")).toBe("value4");
  });

  it("should delete a specific key", () => {
    cache.set("key1", "value1");
    expect(cache.delete("key1")).toBe(true);
    expect(cache.get("key1")).toBeUndefined();
  });

  it("should return false when deleting non-existent key", () => {
    expect(cache.delete("nonexistent")).toBe(false);
  });

  it("should clear all cache", () => {
    cache.set("key1", "value1");
    cache.set("key2", "value2");
    cache.clear();
    expect(cache.get("key1")).toBeUndefined();
    expect(cache.get("key2")).toBeUndefined();
  });

  it("should check existence correctly", () => {
    cache.set("key1", "value1");
    expect(cache.has("key1")).toBe(true);
    expect(cache.has("key2")).toBe(false);
  });

  it("should clean up expired cache entries on operations", () => {
    cache.set("key1", "value1");
    jest.advanceTimersByTime(1500); // 過期
    expect(cache.has("key1")).toBe(false);
  });

  it("should export current cache entries", () => {
    cache.set("key1", "value1");
    cache.set("key2", "value2");
    const exported = cache.exportCache();
    expect(exported.size).toBe(2);
    expect(exported.get("key1")?.value).toBe("value1");
  });
});
