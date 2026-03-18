/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SourceFile } from "ts-morph";
import fs from "node:fs";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadSourceFiles } from "../../../../src/core/scan";

vi.mock("node:fs", () => ({
  default: {
    readFileSync: vi.fn(),
    existsSync: vi.fn(),
  },
}));

let mockGetSourceFiles: () => SourceFile[];
vi.mock("ts-morph", () => {
  return {
    Project: class {
      constructor() {}
      getSourceFiles() {
        return mockGetSourceFiles();
      }
    },
  };
});

const mockSourceFile = (name: string) =>
  ({ getFilePath: () => name }) as unknown as SourceFile;

describe("loadSourceFilesFromTsconfig", () => {
  const tsconfigPath = "/project/tsconfig.json";

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSourceFiles = () => [];
  });

  it("returns source files directly when tsconfig contains files", () => {
    const files = [mockSourceFile("a.ts"), mockSourceFile("b.ts")];
    mockGetSourceFiles = () => files;
    const result = loadSourceFiles(tsconfigPath, false);
    expect(result).toEqual(files);
  });

  it("follows project references when no source files are found", () => {
    // first Project() → root tsconfig
    let call = 0;
    mockGetSourceFiles = () => {
      call++;
      return call === 1 ? [] : [mockSourceFile("ref.ts")];
    };
    (fs.readFileSync as any).mockReturnValue(
      JSON.stringify({
        references: [{ path: "./packages/app" }],
      }),
    );
    (fs.existsSync as any).mockReturnValue(true);
    const result = loadSourceFiles(tsconfigPath, false);
    expect(result).toHaveLength(1);
    expect(result[0]?.getFilePath()).toBe("ref.ts");
  });

  it("skips missing referenced tsconfig files", () => {
    mockGetSourceFiles = () => [];
    (fs.readFileSync as any).mockReturnValue(
      JSON.stringify({
        references: [{ path: "./missing" }],
      }),
    );
    (fs.existsSync as any).mockReturnValue(false);
    const result = loadSourceFiles(tsconfigPath, false);
    expect(result).toEqual([]);
  });

  it("returns empty array when no source files and no references", () => {
    mockGetSourceFiles = () => [];
    (fs.readFileSync as any).mockReturnValue(JSON.stringify({}));
    const result = loadSourceFiles(tsconfigPath, false);
    expect(result).toEqual([]);
  });
});
