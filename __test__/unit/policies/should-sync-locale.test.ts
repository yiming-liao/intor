import { describe, it, expect } from "vitest";
import { shouldSyncLocale } from "../../../src/policies/should-sync-locale";

describe("shouldSyncLocale", () => {
  it("returns false when locales are the same", () => {
    const result = shouldSyncLocale("en-US", "en-US");
    expect(result).toBe(false);
  });

  it("returns true when locales are different", () => {
    const result = shouldSyncLocale("en-US", "zh-TW");
    expect(result).toBe(true);
  });
});
