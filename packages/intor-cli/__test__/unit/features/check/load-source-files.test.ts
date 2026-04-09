/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SourceFile } from "ts-morph";
import fs from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadSourceFiles } from "../../../../src/features/check/load-source-files";
import {
  getSourceFiles,
  readTsConfigReferences,
} from "../../../../src/infrastructure";
import { createLogger } from "../../../../src/shared";
import { br } from "../../../../src/shared";

vi.mock("node:fs", () => ({
  default: {
    existsSync: vi.fn(),
  },
}));

vi.mock("../../../../src/infrastructure", () => ({
  getSourceFiles: vi.fn(),
  readTsConfigReferences: vi.fn(),
}));

vi.mock("../../../../src/shared", () => ({
  createLogger: vi.fn(),
  br: vi.fn(),
  yellow: (value: unknown) => String(value),
}));

const mockSourceFile = (name: string) =>
  ({ getFilePath: () => name }) as unknown as SourceFile;

describe("features/check/loadSourceFiles", () => {
  const logger = {
    header: vi.fn(),
    footer: vi.fn(),
    process: vi.fn(),
    log: vi.fn(),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createLogger).mockReturnValue(logger);
    vi.mocked(readTsConfigReferences).mockReturnValue([]);
    vi.mocked(getSourceFiles).mockReturnValue([]);
    (fs.existsSync as any).mockReturnValue(true);
    vi.spyOn(process, "cwd").mockReturnValue("/repo");
  });

  it("loads source files directly from the root tsconfig when available", () => {
    const files = [mockSourceFile("a.ts"), mockSourceFile("b.ts")];
    vi.mocked(getSourceFiles).mockReturnValueOnce(files);

    expect(loadSourceFiles("/repo/tsconfig.json")).toEqual(files);
    expect(getSourceFiles).toHaveBeenCalledTimes(1);
    expect(getSourceFiles).toHaveBeenCalledWith("/repo/tsconfig.json");
    expect(readTsConfigReferences).not.toHaveBeenCalled();
    expect(logger.footer).toHaveBeenCalledWith("loaded 2 files", {
      kind: "process",
    });
  });

  it("calls br and creates a debug logger when debug mode is enabled", () => {
    loadSourceFiles("/repo/tsconfig.json", true);

    expect(br).toHaveBeenCalledTimes(1);
    expect(createLogger).toHaveBeenCalledWith(true);
  });

  it("returns an empty array when the root tsconfig has no files and no references", () => {
    vi.mocked(getSourceFiles).mockReturnValueOnce([]);
    vi.mocked(readTsConfigReferences).mockReturnValueOnce([]);

    expect(loadSourceFiles("/repo/tsconfig.json")).toEqual([]);
    expect(logger.footer).toHaveBeenCalledWith("no source files found", {
      kind: "process",
    });
  });

  it("follows project references when the root tsconfig is empty", () => {
    vi.mocked(getSourceFiles)
      .mockReturnValueOnce([])
      .mockReturnValueOnce([mockSourceFile("ref-a.ts")])
      .mockReturnValueOnce([mockSourceFile("ref-b.ts")]);
    vi.mocked(readTsConfigReferences).mockReturnValueOnce([
      "/repo/packages/app/tsconfig.app.json",
      "/repo/packages/docs/tsconfig.json",
    ]);

    const result = loadSourceFiles("/repo/tsconfig.json");

    expect(result.map((file) => file.getFilePath())).toEqual([
      "ref-a.ts",
      "ref-b.ts",
    ]);
    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(logger.process).toHaveBeenCalledWith("load", "references (2)");
    expect(logger.process).toHaveBeenCalledWith(
      "load",
      "packages/app/tsconfig.app.json",
    );
    expect(logger.process).toHaveBeenCalledWith(
      "load",
      "packages/docs/tsconfig.json",
    );
    expect(logger.footer).toHaveBeenCalledWith("loaded 2 files", {
      kind: "process",
      lineBreakBefore: 1,
    });
  });

  it("skips missing referenced tsconfig files", () => {
    vi.mocked(getSourceFiles).mockReturnValueOnce([]);
    vi.mocked(readTsConfigReferences).mockReturnValueOnce([
      "/repo/packages/app/tsconfig.app.json",
    ]);
    (fs.existsSync as any).mockReturnValue(false);

    expect(loadSourceFiles("/repo/tsconfig.json")).toEqual([]);
    expect(getSourceFiles).toHaveBeenCalledTimes(1);
    expect(logger.process).toHaveBeenCalledWith(
      "warn",
      "referenced tsconfig not found: packages/app/tsconfig.app.json",
    );
  });
});
