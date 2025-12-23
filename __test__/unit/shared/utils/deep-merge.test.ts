import { describe, it, expect } from "vitest";
import { deepMerge } from "@/shared/utils";

describe("deepMerge", () => {
  it("returns undefined when both inputs are undefined", () => {
    expect(deepMerge(undefined, undefined)).toBeUndefined();
  });

  it("returns first object when second is undefined", () => {
    const a = { x: 1 };
    expect(deepMerge(a, undefined)).toEqual(a);
  });

  it("returns second object when first is undefined", () => {
    const b = { y: 2 };
    expect(deepMerge(undefined, b)).toEqual(b);
  });

  it("merges simple flat objects", () => {
    const a = { x: 1, y: 2 };
    const b = { y: 99, z: 3 };

    expect(deepMerge(a, b)).toEqual({ x: 1, y: 99, z: 3 });
  });

  it("deeply merges nested objects", () => {
    const a = {
      user: {
        name: "Alice",
        info: { age: 20, city: "Taipei" },
      },
    };

    const b = {
      user: {
        info: { city: "Bangkok", hobby: "piano" },
      },
    };

    expect(deepMerge(a, b)).toEqual({
      user: {
        name: "Alice",
        info: { age: 20, city: "Bangkok", hobby: "piano" },
      },
    });
  });

  it("overwrites arrays instead of merging them", () => {
    const a = { arr: [1, 2, 3] };
    const b = { arr: ["a", "b"] };

    expect(deepMerge(a, b)).toEqual({ arr: ["a", "b"] });
  });

  it("overwrites primitives", () => {
    const a = { value: 100 };
    const b = { value: 999 };

    expect(deepMerge(a, b)).toEqual({ value: 999 });
  });

  it("handles mixed nested values correctly", () => {
    const a = {
      a: 1,
      b: { c: 2, d: { e: 3 } },
    };

    const b = {
      b: { d: { e: 999, f: 4 } },
      g: true,
    };

    expect(deepMerge(a, b)).toEqual({
      a: 1,
      b: {
        c: 2,
        d: { e: 999, f: 4 },
      },
      g: true,
    });
  });

  it("does not mutate original objects", () => {
    const a = { x: { y: 1 } };
    const b = { x: { z: 2 } };

    const merged = deepMerge(a, b);

    expect(merged).not.toBe(a);
    expect(merged).not.toBe(b);
    expect(a).toEqual({ x: { y: 1 } });
    expect(b).toEqual({ x: { z: 2 } });
  });

  it("treats null as primitive and overwrites", () => {
    const a = { x: { y: 1 } };
    const b = { x: null };

    expect(deepMerge(a, b)).toEqual({ x: null });
  });

  it("skips inherited properties on b", () => {
    const proto = { inherited: 999 };
    const b = Object.create(proto);
    b.own = 123;
    const result = deepMerge({}, b);
    expect(result).toEqual({ own: 123 });
    expect(result).not.toHaveProperty("inherited");
  });
});
