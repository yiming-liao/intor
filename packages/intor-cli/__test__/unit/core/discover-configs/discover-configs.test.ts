/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { discoverConfigs } from "../../../../src/core/discover-configs/discover-configs";
import { resolveConfigModule } from "../../../../src/core/discover-configs/resolve-config-module";
import { globFiles } from "../../../../src/infrastructure/glob-files";
import { createLogger } from "../../../../src/logger";
import { br } from "../../../../src/render";

vi.mock("../../../../src/infrastructure/glob-files", () => ({
  globFiles: vi.fn(),
}));

vi.mock("../../../../src/core/discover-configs/resolve-config-module", () => ({
  resolveConfigModule: vi.fn(),
}));

vi.mock("../../../../src/logger", () => ({
  createLogger: vi.fn(),
}));

vi.mock("../../../../src/render", () => ({
  br: vi.fn(),
  yellow: (v: unknown) => String(v),
}));

describe("discoverConfigs", () => {
  const logger = {
    header: vi.fn(),
    footer: vi.fn(),
    process: vi.fn(),
    log: vi.fn(),
    ok: vi.fn(),
    error: vi.fn(),
  } as any;

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    vi.mocked(createLogger).mockReturnValue(logger);
    vi.spyOn(process, "cwd").mockReturnValue("/repo");
  });

  it("returns [] and warns when no candidate files are found", async () => {
    vi.mocked(globFiles).mockResolvedValue([]);
    const result = await discoverConfigs();
    expect(result).toEqual([]);
    expect(createLogger).toHaveBeenCalledWith(false);
    expect(logger.process).toHaveBeenCalledWith(
      "warn",
      "no Intor config discovered",
    );
    expect(logger.footer).toHaveBeenCalled();
    expect(br).not.toHaveBeenCalled();
  });

  it("calls br when debug=true", async () => {
    vi.mocked(globFiles).mockResolvedValue([]);
    await discoverConfigs(true);
    expect(br).toHaveBeenCalledTimes(1);
    expect(createLogger).toHaveBeenCalledWith(true);
  });

  it("skips unreadable files", async () => {
    vi.mocked(globFiles).mockResolvedValue(["a.ts"]);
    vi.spyOn(fs.promises, "readFile").mockRejectedValue(new Error("fail"));
    const result = await discoverConfigs();
    expect(result).toEqual([]);
    expect(logger.process).toHaveBeenCalledWith("warn", "failed to read a.ts");
    expect(resolveConfigModule).not.toHaveBeenCalled();
  });

  it("skips files without defineIntorConfig marker", async () => {
    vi.mocked(globFiles).mockResolvedValue(["a.ts"]);
    vi.spyOn(fs.promises, "readFile").mockResolvedValue("export const x = 1");
    const result = await discoverConfigs();
    expect(result).toEqual([]);
    expect(logger.process).toHaveBeenCalledWith(
      "skip",
      "a.ts (missing defineIntorConfig)",
    );
    expect(resolveConfigModule).not.toHaveBeenCalled();
  });

  it("loads marked files and forwards params to resolveConfigModule", async () => {
    vi.mocked(globFiles).mockResolvedValue(["src/a.ts"]);
    vi.spyOn(fs.promises, "readFile").mockResolvedValue(
      "defineIntorConfig({})",
    );
    vi.mocked(resolveConfigModule).mockResolvedValue([
      {
        filePath: "/repo/src/a.ts",
        config: {
          id: "id-a",
          defaultLocale: "en",
          supportedLocales: ["en"],
        } as any,
      },
    ]);
    const result = await discoverConfigs();
    expect(resolveConfigModule).toHaveBeenCalledTimes(1);
    expect(resolveConfigModule).toHaveBeenCalledWith({
      ids: expect.any(Set),
      absPath: path.resolve("/repo", "src/a.ts"),
      relPath: "src/a.ts",
      logger,
    });
    expect(result).toHaveLength(1);
    expect(result[0]?.filePath).toBe("/repo/src/a.ts");
  });

  it("returns entries sorted by filePath", async () => {
    vi.mocked(globFiles).mockResolvedValue(["b.ts", "a.ts"]);
    vi.spyOn(fs.promises, "readFile").mockResolvedValue(
      "defineIntorConfig({})",
    );
    vi.mocked(resolveConfigModule)
      .mockResolvedValueOnce([
        {
          filePath: "/repo/b.ts",
          config: {
            id: "b",
            defaultLocale: "en",
            supportedLocales: ["en"],
          } as any,
        },
      ])
      .mockResolvedValueOnce([
        {
          filePath: "/repo/a.ts",
          config: {
            id: "a",
            defaultLocale: "en",
            supportedLocales: ["en"],
          } as any,
        },
      ]);
    const result = await discoverConfigs();
    expect(result.map((r) => r.filePath)).toEqual(["/repo/a.ts", "/repo/b.ts"]);
  });

  it("does not emit no-discovered warning when at least one config is resolved", async () => {
    vi.mocked(globFiles).mockResolvedValue(["a.ts"]);
    vi.spyOn(fs.promises, "readFile").mockResolvedValue(
      "defineIntorConfig({})",
    );
    vi.mocked(resolveConfigModule).mockResolvedValue([
      {
        filePath: "/repo/a.ts",
        config: {
          id: "a",
          defaultLocale: "en",
          supportedLocales: ["en"],
        } as any,
      },
    ]);
    await discoverConfigs();
    expect(logger.process).not.toHaveBeenCalledWith(
      "warn",
      "no Intor config discovered",
    );
  });
});
