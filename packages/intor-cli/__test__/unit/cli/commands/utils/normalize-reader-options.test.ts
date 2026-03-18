import { describe, it, expect } from "vitest";
import { normalizeReaderOptions } from "../../../../../src/cli/commands/utils/normalize-reader-options";

describe("normalizeReaderOptions", () => {
  it("returns empty options when no ext and reader are provided", () => {
    const result = normalizeReaderOptions({});

    expect(result).toEqual({
      exts: [],
      customReaders: {},
    });
  });

  it("normalizes ext into array", () => {
    const result = normalizeReaderOptions({
      ext: ["md", "json5"],
    });

    expect(result.exts).toEqual(["md", "json5"]);
    expect(result.customReaders).toEqual({});
  });

  it("normalizes reader mappings correctly", () => {
    const result = normalizeReaderOptions({
      reader: ["md=./reader-md.ts", "json=./reader-json.ts"],
    });

    expect(result.exts).toEqual([]);
    expect(result.customReaders).toEqual({
      md: "./reader-md.ts",
      json: "./reader-json.ts",
    });
  });

  it("supports both ext and reader together", () => {
    const result = normalizeReaderOptions({
      ext: ["md"],
      reader: ["md=./reader-md.ts"],
    });

    expect(result.exts).toEqual(["md"]);
    expect(result.customReaders).toEqual({
      md: "./reader-md.ts",
    });
  });

  it("throws when reader entry is missing '='", () => {
    expect(() =>
      normalizeReaderOptions({
        reader: ["md./reader.ts"],
      }),
    ).toThrow(
      'Invalid --reader entry: "md./reader.ts". Each entry must be in the form: <ext=path>',
    );
  });

  it("throws when reader entry has empty key", () => {
    expect(() =>
      normalizeReaderOptions({
        reader: ["=./reader.ts"],
      }),
    ).toThrow(
      'Invalid --reader entry: "=./reader.ts". Each entry must be in the form: <ext=path>',
    );
  });

  it("throws when reader entry has empty value", () => {
    expect(() =>
      normalizeReaderOptions({
        reader: ["md="],
      }),
    ).toThrow(
      'Invalid --reader entry: "md=". Each entry must be in the form: <ext=path>',
    );
  });
});
