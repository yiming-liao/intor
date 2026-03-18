import { describe, it, expect } from "vitest";
import { indexUsagesByKey } from "../../../../../../src/features/check/diagnostics/utils/index-usages-by-key";

describe("indexUsagesByKey", () => {
  it("groups usages by resolved message key", () => {
    const usages = [
      { method: "t" as const, key: "title", preKey: "home", id: 1 },
      { method: "t" as const, key: "title", preKey: "home", id: 2 },
      { method: "t" as const, key: "subtitle", preKey: "home", id: 3 },
    ];
    const index = indexUsagesByKey(usages);
    expect(index.size).toBe(2);
    expect(index.get("t::home.title")).toHaveLength(2);
    expect(index.get("t::home.subtitle")).toHaveLength(1);
  });

  it("resolves keys without preKey correctly", () => {
    const usages = [
      { method: "t" as const, key: "greeting", id: 1 },
      { method: "t" as const, key: "greeting", id: 2 },
    ];
    const index = indexUsagesByKey(usages);
    expect(index.size).toBe(1);
    expect(index.get("t::greeting")).toEqual([
      { method: "t" as const, key: "greeting", id: 1 },
      { method: "t" as const, key: "greeting", id: 2 },
    ]);
  });

  it("separates usages with different preKeys", () => {
    const usages = [
      { method: "t" as const, key: "title", preKey: "home", id: 1 },
      { method: "t" as const, key: "title", preKey: "about", id: 2 },
    ];
    const index = indexUsagesByKey(usages);
    expect(index.size).toBe(2);
    expect(index.get("t::home.title")?.[0]?.id).toBe(1);
    expect(index.get("t::about.title")?.[0]?.id).toBe(2);
  });

  it("returns an empty map when given no usages", () => {
    const index = indexUsagesByKey([]);
    expect(index).toBeInstanceOf(Map);
    expect(index.size).toBe(0);
  });

  it("preserves original usage objects without mutation", () => {
    const usage = { method: "t" as const, key: "title", preKey: "home" };
    const index = indexUsagesByKey([usage]);
    const stored = index.get("t::home.title")?.[0];
    expect(stored).toBe(usage);
  });
});
