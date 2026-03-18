/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ExtractedUsages } from "../../../../src/core";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildScopeUsages } from "../../../../src/features/check/build-scoped-usages";
import { dedupePreKeyUsages } from "../../../../src/features/check/dedupe-pre-key-usages";

vi.mock("../../../../src/features/check/dedupe-pre-key-usages", () => ({
  dedupePreKeyUsages: vi.fn(),
}));

describe("buildScopeUsages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters usages by configKey and applies dedupe only to preKey", () => {
    const usages: ExtractedUsages = {
      preKey: [
        { configKey: "a", id: 1 } as any,
        { configKey: "b", id: 2 } as any,
        { configKey: "__default__", id: 3 } as any,
      ],
      key: [{ configKey: "a", id: 4 } as any, { configKey: "b", id: 5 } as any],
      replacement: [
        { configKey: "a", id: 6 } as any,
        { configKey: "b", id: 7 } as any,
      ],
      rich: [
        { configKey: "a", id: 8 } as any,
        { configKey: "b", id: 9 } as any,
      ],
      trans: [
        { configKey: "a", id: 10 } as any,
        { configKey: "b", id: 11 } as any,
      ],
    };
    vi.mocked(dedupePreKeyUsages).mockImplementation((v) => v);
    const result = buildScopeUsages({
      usages,
      defaultConfigKey: "a",
      configKey: "a",
    }); // preKey: includes explicit + __default__
    expect(result.preKey.map((u: any) => u.id)).toEqual([1, 3]);
    expect(result.key.map((u: any) => u.id)).toEqual([4]);
    expect(result.replacement.map((u: any) => u.id)).toEqual([6]);
    expect(result.rich.map((u: any) => u.id)).toEqual([8]);
    expect(result.trans.map((u: any) => u.id)).toEqual([10]); // dedupe only applied to preKey
    expect(dedupePreKeyUsages).toHaveBeenCalledTimes(1);
    expect(dedupePreKeyUsages).toHaveBeenCalledWith([
      { configKey: "a", id: 1 },
      { configKey: "__default__", id: 3 },
    ]);
  });

  it("treats undefined configKey as default", () => {
    const usages: ExtractedUsages = {
      preKey: [{ id: 1 } as any],
      key: [{ id: 2 } as any],
      replacement: [],
      rich: [],
      trans: [],
    };
    vi.mocked(dedupePreKeyUsages).mockImplementation((v) => v);
    const result = buildScopeUsages({
      usages,
      defaultConfigKey: "default",
      configKey: "default",
    });
    expect(result.preKey).toHaveLength(1);
    expect(result.key).toHaveLength(1);
  });

  it("returns empty arrays when no usages match the configKey", () => {
    const usages: ExtractedUsages = {
      preKey: [{ configKey: "a" } as any],
      key: [{ configKey: "a" } as any],
      replacement: [],
      rich: [],
      trans: [],
    };
    vi.mocked(dedupePreKeyUsages).mockImplementation((v) => v);
    const result = buildScopeUsages({
      usages,
      defaultConfigKey: "a",
      configKey: "b",
    });
    expect(result.preKey).toEqual([]);
    expect(result.key).toEqual([]);
    expect(result.replacement).toEqual([]);
    expect(result.rich).toEqual([]);
    expect(result.trans).toEqual([]);
  });
});
