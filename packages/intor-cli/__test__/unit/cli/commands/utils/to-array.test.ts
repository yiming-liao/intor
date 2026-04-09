import { describe, expect, it } from "vitest";
import { toArray } from "../../../../../src/cli/commands/utils/to-array";

describe("toArray", () => {
  it("returns an empty array for undefined", () => {
    expect(toArray(undefined)).toEqual([]);
  });

  it("returns the original array when the value is already an array", () => {
    expect(toArray(["md", "json5"])).toEqual(["md", "json5"]);
  });

  it("wraps a scalar value in an array", () => {
    expect(toArray("md")).toEqual(["md"]);
  });
});
