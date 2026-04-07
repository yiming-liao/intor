/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readTsConfigReferences } from "../../../../src/infrastructure/tsconfig/read-ts-config-references";

const mockReadConfigFile = vi.fn();
const mockSysReadFile = vi.fn();

vi.mock("node:fs", () => ({
  default: {
    existsSync: vi.fn(),
    statSync: vi.fn(),
  },
}));

vi.mock("typescript", () => ({
  default: {
    readConfigFile: (...args: unknown[]) => mockReadConfigFile(...args),
    sys: {
      readFile: (...args: unknown[]) => mockSysReadFile(...args),
    },
  },
}));

describe("readTsConfigReferences", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fs.existsSync as any).mockReturnValue(false);
    mockReadConfigFile.mockReturnValue({ config: {} });
    mockSysReadFile.mockReturnValue("{}");
  });

  it("returns resolved reference paths when the tsconfig contains references", () => {
    mockReadConfigFile.mockReturnValue({
      config: {
        references: [
          { path: "./app/tsconfig.app.json" },
          { path: "../shared" },
        ],
      },
    });

    expect(readTsConfigReferences("/repo/packages/web/tsconfig.json")).toEqual([
      "/repo/packages/web/app/tsconfig.app.json",
      "/repo/packages/shared",
    ]);
  });

  it("normalizes directory references to tsconfig.json", () => {
    mockReadConfigFile.mockReturnValue({
      config: {
        references: [{ path: "./packages/app" }],
      },
    });
    (fs.existsSync as any).mockReturnValue(true);
    (fs.statSync as any).mockReturnValue({
      isDirectory: () => true,
    });

    expect(readTsConfigReferences("/repo/tsconfig.json")).toEqual([
      "/repo/packages/app/tsconfig.json",
    ]);
  });

  it("keeps explicit tsconfig file references unchanged", () => {
    mockReadConfigFile.mockReturnValue({
      config: {
        references: [{ path: "./packages/app/tsconfig.main.json" }],
      },
    });
    (fs.existsSync as any).mockReturnValue(true);
    (fs.statSync as any).mockReturnValue({
      isDirectory: () => false,
    });

    expect(readTsConfigReferences("/repo/tsconfig.json")).toEqual([
      "/repo/packages/app/tsconfig.main.json",
    ]);
  });

  it("returns a self reference as the same tsconfig path", () => {
    mockReadConfigFile.mockReturnValue({
      config: {
        references: [{ path: "./" }],
      },
    });
    (fs.existsSync as any).mockReturnValue(true);
    (fs.statSync as any).mockReturnValue({
      isDirectory: () => true,
    });

    expect(readTsConfigReferences("/repo/tsconfig.json")).toEqual([
      "/repo/tsconfig.json",
    ]);
  });

  it("returns an empty array when the tsconfig has no references", () => {
    mockReadConfigFile.mockReturnValue({ config: {} });

    expect(readTsConfigReferences("/repo/tsconfig.json")).toEqual([]);
  });

  it("returns an empty array when references is not a valid reference array", () => {
    mockReadConfigFile.mockReturnValue({
      config: {
        references: [{ path: 123 }, null, "bad"],
      },
    });

    expect(readTsConfigReferences("/repo/tsconfig.json")).toEqual([]);
  });

  it("supports tsconfig jsonc comments via the TypeScript parser", () => {
    mockReadConfigFile.mockReturnValue({
      config: {
        references: [{ path: "./packages/app" }],
      },
    });
    (fs.existsSync as any).mockReturnValue(true);
    (fs.statSync as any).mockReturnValue({
      isDirectory: () => true,
    });

    expect(readTsConfigReferences("/repo/tsconfig.json")).toEqual([
      "/repo/packages/app/tsconfig.json",
    ]);
  });

  it("supports tsconfig trailing commas via the TypeScript parser", () => {
    mockReadConfigFile.mockReturnValue({
      config: {
        references: [{ path: "./packages/app/tsconfig.main.json" }],
      },
    });

    expect(readTsConfigReferences("/repo/tsconfig.json")).toEqual([
      "/repo/packages/app/tsconfig.main.json",
    ]);
  });

  it("passes a bound readFile callback to the TypeScript parser", () => {
    mockReadConfigFile.mockImplementation((filePath, readFile) => {
      readFile(filePath);
      return {
        config: {
          references: [],
        },
      };
    });

    expect(readTsConfigReferences("/repo/tsconfig.json")).toEqual([]);
    expect(mockSysReadFile).toHaveBeenCalledWith("/repo/tsconfig.json");
  });
});
