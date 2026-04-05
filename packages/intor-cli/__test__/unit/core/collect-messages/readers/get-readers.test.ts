/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getBuiltInReaders } from "../../../../../src/core/collect-messages/readers/built-in-readers";
import { getReaders } from "../../../../../src/core/collect-messages/readers/get-readers";
import { resolveReaderModule } from "../../../../../src/core/collect-messages/readers/resolve-reader-module";

vi.mock(
  "../../../../../src/core/collect-messages/readers/built-in-readers",
  () => ({
    getBuiltInReaders: vi.fn(),
  }),
);

vi.mock(
  "../../../../../src/core/collect-messages/readers/resolve-reader-module",
  () => ({
    resolveReaderModule: vi.fn(),
  }),
);

describe("getReaders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns built-in readers only when no custom readers are provided", async () => {
    const mdReader = vi.fn();
    vi.mocked(getBuiltInReaders).mockReturnValue({ md: mdReader });

    const result = await getReaders({ exts: ["md"] });

    expect(getBuiltInReaders).toHaveBeenCalledWith(["md"]);
    expect(resolveReaderModule).not.toHaveBeenCalled();
    expect(result).toEqual({ md: mdReader });
  });

  it("resolves and merges custom readers with built-in readers", async () => {
    const mdReader = vi.fn();
    const customReader = vi.fn();
    vi.mocked(getBuiltInReaders).mockReturnValue({ md: mdReader });
    vi.mocked(resolveReaderModule).mockResolvedValue(customReader as any);

    const result = await getReaders({
      exts: ["md"],
      customReaders: { foo: "./foo-reader.ts" },
    });

    expect(resolveReaderModule).toHaveBeenCalledTimes(1);
    expect(resolveReaderModule).toHaveBeenCalledWith({
      filePath: "./foo-reader.ts",
    });
    expect(result).toEqual({
      md: mdReader,
      foo: customReader,
    });
  });

  it("lets custom readers override built-in readers with the same key", async () => {
    const builtInMd = vi.fn();
    const customMd = vi.fn();
    vi.mocked(getBuiltInReaders).mockReturnValue({ md: builtInMd });
    vi.mocked(resolveReaderModule).mockResolvedValue(customMd as any);

    const result = await getReaders({
      exts: ["md"],
      customReaders: { md: "./custom-md-reader.ts" },
    });

    expect(result["md"]).toBe(customMd);
  });

  it("skips custom reader entry when resolved reader is undefined", async () => {
    const mdReader = vi.fn();
    vi.mocked(getBuiltInReaders).mockReturnValue({ md: mdReader });
    vi.mocked(resolveReaderModule).mockResolvedValue(undefined as any);

    const result = await getReaders({
      exts: ["md"],
      customReaders: { foo: "./foo-reader.ts" },
    });

    expect(result).toEqual({ md: mdReader });
    expect(result).not.toHaveProperty("foo");
  });

  it("uses empty exts by default", async () => {
    vi.mocked(getBuiltInReaders).mockReturnValue({});

    await getReaders({});

    expect(getBuiltInReaders).toHaveBeenCalledWith([]);
  });
});
