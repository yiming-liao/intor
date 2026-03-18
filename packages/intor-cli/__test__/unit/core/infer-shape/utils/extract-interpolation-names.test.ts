import { describe, it, expect } from "vitest";
import { extractInterpolationNames } from "../../../../../src/core/infer-shape/utils/extract-interpolation-names";

describe("extractInterpolationNames – basic cases", () => {
  it("returns an empty array when no interpolations exist", () => {
    expect(extractInterpolationNames("Hello world")).toEqual([]);
  });

  it("extracts a single interpolation name", () => {
    expect(extractInterpolationNames("Hello {name}")).toEqual(["name"]);
  });

  it("extracts multiple interpolation names", () => {
    const result = extractInterpolationNames("Hello {first} {last}");
    expect(result.sort()).toEqual(["first", "last"]);
  });

  it("deduplicates repeated interpolation names", () => {
    const result = extractInterpolationNames("{name} says hello to {name}");
    expect(result).toEqual(["name"]);
  });

  it("treats '_' as a valid interpolation name", () => {
    expect(extractInterpolationNames("{_}")).toEqual(["_"]);
  });

  it("handles adjacent interpolations correctly", () => {
    const result = extractInterpolationNames("{a}{b}{c}");
    expect(result.sort()).toEqual(["a", "b", "c"]);
  });
});

describe("extractInterpolationNames – ICU style syntax", () => {
  it("extracts argument name from plural syntax", () => {
    expect(
      extractInterpolationNames(
        "{count, plural, =0 {no messages} one {1 message} other {# messages}}",
      ),
    ).toEqual(["count"]);
  });

  it("extracts argument name from select syntax", () => {
    expect(
      extractInterpolationNames(
        "{gender, select, male {He} female {She} other {They}}",
      ),
    ).toEqual(["gender"]);
  });

  it("extracts multiple argument names from mixed ICU messages", () => {
    const result = extractInterpolationNames(
      "{name} has {count, plural, one {1 message} other {# messages}}",
    );
    expect(result.sort()).toEqual(["count", "name"]);
  });
});

describe("extractInterpolationNames – nested & edge cases", () => {
  it("ignores nested braces inside ICU bodies", () => {
    expect(
      extractInterpolationNames("{count, plural, one {{x}} other {{y}}}"),
    ).toEqual(["count"]);
  });

  it("ignores deeply nested ICU content", () => {
    expect(
      extractInterpolationNames("{value, select, a {{b{c{d}}}} other {{e}}}"),
    ).toEqual(["value"]);
  });

  it("ignores unmatched opening braces", () => {
    expect(extractInterpolationNames("{foo{bar}")).toEqual([]);
  });

  it("handles unmatched closing braces gracefully", () => {
    // Only the valid outermost interpolation is captured
    expect(extractInterpolationNames("foo{bar}}")).toEqual(["bar"]);
  });

  it("ignores empty interpolation blocks", () => {
    expect(extractInterpolationNames("{}")).toEqual([]);
  });

  it("ignores whitespace-only interpolation blocks", () => {
    expect(extractInterpolationNames("{   }")).toEqual([]);
  });
});
