import {
  setCacheForTest,
  messageKeyCache,
} from "@/intor/core/intor-translator/cache";
import { getValueByKey } from "@/intor/core/intor-translator/utils/get-value-by-key";
import { mockMessageRecord } from "test/mock/message-record.mock";

describe("getValueByKey", () => {
  beforeEach(() => {
    setCacheForTest();
    messageKeyCache?.clear();
  });

  it("should return top-level nested value by key and cache it", () => {
    const key = "system.error.network";
    const result = getValueByKey(mockMessageRecord, key);
    expect(result).toBe("Network error occurred. Please try again.");
    expect(messageKeyCache?.has(key)).toBe(true);
    expect(messageKeyCache?.get(key)).toBe(
      "Network error occurred. Please try again.",
    );
  });

  it("should return deeply nested value by key and cache it", () => {
    const key = "user.profile.greeting";
    const result = getValueByKey(mockMessageRecord, key);
    expect(result).toBe("Hello, {user.profile.name}!");
    expect(messageKeyCache?.has(key)).toBe(true);
    expect(messageKeyCache?.get(key)).toBe("Hello, {user.profile.name}!");
  });

  it("should return undefined if key does not exist and not cache it", () => {
    const key = "user.profile.age";
    const result = getValueByKey(mockMessageRecord, key);
    expect(result).toBeUndefined();
    expect(messageKeyCache?.has(key)).toBe(false);
  });

  it("should use cached value if it exists", () => {
    const key = "system.error.server";
    messageKeyCache?.set(key, "Cached Server Error");
    const result = getValueByKey(mockMessageRecord, key);
    expect(result).toBe("Cached Server Error");
  });

  it("should bypass cache if useCache = false", () => {
    const key = "user.notifications.unread";
    messageKeyCache?.set(key, "Cached Old Message");
    const result = getValueByKey(mockMessageRecord, key, false);
    expect(result).toBe("You have {user.notifications.count} unread messages.");
    expect(messageKeyCache?.get(key)).toBe("Cached Old Message");
  });
});
