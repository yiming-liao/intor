/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from "node:fs";
import fg from "fast-glob";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { discoverConfigs } from "../../../../src/core/discover-configs/discover-configs";
import { isIntorResolvedConfig } from "../../../../src/core/discover-configs/is-intor-resolved-config";
import { loadModule } from "../../../../src/core/discover-configs/load-module";

vi.mock("fast-glob", () => ({
  default: vi.fn(),
}));

vi.mock("../../../../src/core/scan-logger", () => ({
  createLogger: () => () => {},
}));

vi.mock(
  "../../../../src/core/discover-configs/is-intor-resolved-config",
  () => ({
    isIntorResolvedConfig: vi.fn(),
  }),
);

vi.mock("../../../../src/core/discover-configs/load-module", () => ({
  loadModule: vi.fn(),
}));

describe("discoverConfigs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty array when no files are found", async () => {
    vi.mocked(fg).mockResolvedValue([]);
    const result = await discoverConfigs();
    expect(result).toEqual([]);
  });

  it("skips files that cannot be read", async () => {
    vi.mocked(fg).mockResolvedValue(["a.ts"]);
    vi.spyOn(fs.promises, "readFile").mockRejectedValue(new Error("fail"));
    const result = await discoverConfigs();
    expect(result).toEqual([]);
  });

  it("skips files without defineIntorConfig", async () => {
    vi.mocked(fg).mockResolvedValue(["a.ts"]);
    vi.mocked(fs.promises.readFile).mockResolvedValue("export const x = 1");
    const result = await discoverConfigs();
    expect(result).toEqual([]);
  });

  it("collects valid IntorResolvedConfig exports", async () => {
    vi.mocked(fg).mockResolvedValue(["a.ts"]);
    vi.spyOn(fs.promises, "readFile").mockResolvedValue(
      "export const config = defineIntorConfig({})",
    );
    vi.mocked(isIntorResolvedConfig).mockReturnValue(true);
    vi.mocked(loadModule).mockResolvedValue({
      config: { id: "my-intor", defaultLocale: "en", supportedLocales: ["en"] },
    });
    const result = await discoverConfigs();
    expect(result).toHaveLength(1);
    expect(result[0]?.config.id).toBe("my-intor");
  });

  it("returns empty array when no usable Intor config export is found", async () => {
    vi.mocked(fg).mockResolvedValue(["a.ts"]);
    vi.spyOn(fs.promises, "readFile").mockResolvedValue("export const x = {}");
    vi.mocked(isIntorResolvedConfig).mockReturnValue(false);
    vi.mocked(loadModule).mockResolvedValue({ x: {} });
    const result = await discoverConfigs();
    expect(result).toEqual([]);
  });

  it("handles import failure gracefully", async () => {
    vi.mocked(fg).mockResolvedValue(["a.ts"]);
    vi.spyOn(fs.promises, "readFile").mockResolvedValue(
      "export const config = defineIntorConfig({})",
    );
    vi.mocked(loadModule).mockRejectedValue(new Error("import failed"));
    const result = await discoverConfigs();
    expect(result).toEqual([]);
  });

  it("ignores duplicate config ids across files", async () => {
    vi.mocked(fg).mockResolvedValue(["a.ts", "b.ts"]);
    vi.spyOn(fs.promises, "readFile").mockResolvedValue(
      "export const config = defineIntorConfig({})",
    );
    vi.mocked(isIntorResolvedConfig).mockReturnValue(true);
    vi.mocked(loadModule)
      .mockResolvedValueOnce({
        config: {
          id: "my-intor",
          defaultLocale: "en",
          supportedLocales: ["en"],
        },
      })
      .mockResolvedValueOnce({
        config: {
          id: "my-intor",
          defaultLocale: "en",
          supportedLocales: ["en"],
        },
      });
    const result = await discoverConfigs();
    expect(result).toHaveLength(1);
    expect(result[0]?.config.id).toBe("my-intor");
  });

  it("skips non-Intor exports and continues scanning other exports", async () => {
    vi.mocked(fg).mockResolvedValue(["a.ts"]);
    vi.spyOn(fs.promises, "readFile").mockResolvedValue(
      "export const foo = {}; export const config = defineIntorConfig({})",
    );
    vi.mocked(isIntorResolvedConfig).mockImplementation(
      (v) => (v as any)?.id === "my-intor",
    );
    vi.mocked(loadModule).mockResolvedValue({
      foo: {},
      config: { id: "my-intor", defaultLocale: "en", supportedLocales: ["en"] },
    });
    const result = await discoverConfigs();
    expect(result).toHaveLength(1);
    expect(result[0]?.config.id).toBe("my-intor");
  });
});
