/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SourceFile } from "ts-morph";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  extractUsages,
  type ExtractedUsages,
} from "../../../../src/core/extract-usages";
import { extractUsagesFromSourceFile } from "../../../../src/core/extract-usages/extract-usages-from-source-file";

// --------------------------------------------------
// Mocks
// --------------------------------------------------
vi.mock(
  "../../../../src/core/extract-usages/extract-usages-from-source-file",
  () => ({
    extractUsagesFromSourceFile: vi.fn(),
  }),
);

vi.mock("../../../../src/core/scan/scan-logger", () => ({
  createScanLogger: () => ({
    header: vi.fn(),
    log: vi.fn(),
    footer: vi.fn(),
  }),
}));

// --------------------------------------------------
// Helpers
// --------------------------------------------------
const mockSourceFile = (path: string) =>
  ({ getFilePath: () => path }) as SourceFile;

const empty: ExtractedUsages = {
  preKey: [],
  key: [],
  replacement: [],
  rich: [],
  trans: [],
};

// --------------------------------------------------
// Tests
// --------------------------------------------------
describe("extractUsages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty result when no source files are provided", () => {
    const result = extractUsages();
    expect(result).toEqual(empty);
    expect(extractUsagesFromSourceFile).not.toHaveBeenCalled();
  });

  it("skips files whose file-level extraction is fully empty", () => {
    const files = [mockSourceFile("a.ts"), mockSourceFile("b.ts")];
    vi.mocked(extractUsagesFromSourceFile).mockReturnValue(empty);
    const result = extractUsages({ sourceFiles: files });
    expect(result).toEqual(empty);
    expect(extractUsagesFromSourceFile).toHaveBeenCalledTimes(2);
  });

  it("merges usages from multiple source files including trans usages", () => {
    const files = [mockSourceFile("a.ts"), mockSourceFile("b.ts")];
    vi.mocked(extractUsagesFromSourceFile)
      .mockReturnValueOnce({
        preKey: [{ preKey: "home" } as any],
        key: [{ key: "title" } as any],
        replacement: [],
        rich: [],
        trans: [{ key: "home.title" } as any],
      })
      .mockReturnValueOnce({
        preKey: [],
        key: [],
        replacement: [{ key: "count" } as any],
        rich: [{ key: "content" } as any],
        trans: [{ key: "profile.name" } as any],
      });
    const result = extractUsages({ sourceFiles: files });
    expect(result.preKey).toHaveLength(1);
    expect(result.key).toHaveLength(1);
    expect(result.replacement).toHaveLength(1);
    expect(result.rich).toHaveLength(1);
    expect(result.trans).toHaveLength(2);
  });

  it("does not change behavior when debug flag is enabled", () => {
    const files = [mockSourceFile("a.ts")];
    vi.mocked(extractUsagesFromSourceFile).mockReturnValue(empty);
    const result = extractUsages({ sourceFiles: files, debug: true });
    expect(result).toEqual(empty);
    expect(extractUsagesFromSourceFile).toHaveBeenCalledOnce();
  });
});
