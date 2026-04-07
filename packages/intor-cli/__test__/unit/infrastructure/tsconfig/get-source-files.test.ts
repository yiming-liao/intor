import type { SourceFile } from "ts-morph";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSourceFiles } from "../../../../src/infrastructure/tsconfig/get-source-files";

const mockGetSourceFiles = vi.fn<() => SourceFile[]>();
const mockProject = vi.fn();

vi.mock("ts-morph", () => ({
  Project: class {
    constructor(options: { tsConfigFilePath: string }) {
      mockProject(options);
    }

    getSourceFiles() {
      return mockGetSourceFiles();
    }
  },
}));

describe("getSourceFiles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a ts-morph project with the provided tsconfig path", () => {
    mockGetSourceFiles.mockReturnValueOnce([]);

    getSourceFiles("/repo/tsconfig.json");

    expect(mockProject).toHaveBeenCalledTimes(1);
    expect(mockProject).toHaveBeenCalledWith({
      tsConfigFilePath: "/repo/tsconfig.json",
    });
  });

  it("returns source files from the created project", () => {
    const files = [{ getFilePath: () => "a.ts" }] as SourceFile[];
    mockGetSourceFiles.mockReturnValueOnce(files);

    expect(getSourceFiles("/repo/tsconfig.json")).toBe(files);
  });
});
