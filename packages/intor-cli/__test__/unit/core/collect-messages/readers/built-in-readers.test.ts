/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "vitest";
import {
  BUILTIN_READERS,
  getBuiltInReaders,
} from "../../../../../src/core/collect-messages/readers/built-in-readers";

describe("getBuiltInReaders", () => {
  it("returns all requested built-in readers", () => {
    expect(getBuiltInReaders(["md", "yaml", "toml", "json5"])).toEqual({
      md: BUILTIN_READERS.md,
      yaml: BUILTIN_READERS.yaml,
      toml: BUILTIN_READERS.toml,
      json5: BUILTIN_READERS.json5,
    });
  });

  it("returns an empty object when no extensions are provided", () => {
    expect(getBuiltInReaders([])).toEqual({});
  });

  it("skips unknown extensions at runtime", () => {
    const result = getBuiltInReaders(["md", "unknown"] as any);

    expect(result).toEqual({
      md: BUILTIN_READERS.md,
    });
    expect(result).not.toHaveProperty("unknown");
  });
});
