import { describe, it, expect } from "vitest";
import {
  compareStableStrings,
  sortKeysDeep,
} from "../../../../src/core/artifacts/sort-keys-deep";

describe("sortKeysDeep", () => {
  it("compares strings deterministically", () => {
    expect(compareStableStrings("a", "b")).toBeLessThan(0);
    expect(compareStableStrings("b", "a")).toBeGreaterThan(0);
    expect(compareStableStrings("a", "a")).toBe(0);
  });

  it("sorts object keys recursively", () => {
    const input = {
      z: 1,
      b: {
        d: 1,
        a: 2,
      },
      a: 3,
    };

    const output = sortKeysDeep(input);

    expect(Object.keys(output)).toEqual(["a", "b", "z"]);
    expect(Object.keys(output.b)).toEqual(["a", "d"]);
  });

  it("keeps array order while sorting object items inside arrays", () => {
    const input = [
      { b: 2, a: 1 },
      { d: 4, c: 3 },
    ];

    const output = sortKeysDeep(input);

    expect(output).toEqual([
      { a: 1, b: 2 },
      { c: 3, d: 4 },
    ]);
  });

  it("does not mutate the input object", () => {
    const input = {
      b: { y: 1, x: 2 },
      a: 3,
    };

    const output = sortKeysDeep(input);

    expect(Object.keys(input)).toEqual(["b", "a"]);
    expect(Object.keys(input.b)).toEqual(["y", "x"]);
    expect(Object.keys(output)).toEqual(["a", "b"]);
    expect(Object.keys(output.b)).toEqual(["x", "y"]);
  });

  it("supports null-prototype objects", () => {
    const input = Object.create(null) as Record<string, unknown>;
    input["z"] = 1;
    input["a"] = 2;

    const output = sortKeysDeep(input);

    expect(Object.keys(output)).toEqual(["a", "z"]);
  });
});
