/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { extractUsages, prepareSchema } from "../../../../src/core";
import { check } from "../../../../src/features/check/check";
import {
  collectDiagnostics,
  groupDiagnostics,
} from "../../../../src/features/check/diagnostics";
import { filterUsagesByConfig } from "../../../../src/features/check/filter-usages-by-config";
import { loadSourceFiles } from "../../../../src/features/check/load-source-files";
import { renderConfigSummary } from "../../../../src/features/check/render-config-summary";
import { writeJsonReport } from "../../../../src/infrastructure";
import { renderTitle, FEATURES, spinner } from "../../../../src/shared";

vi.mock("../../../../src/core", () => ({
  extractUsages: vi.fn(),
  prepareSchema: vi.fn(),
}));

vi.mock("../../../../src/shared", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../../../src/shared")>();
  return {
    ...actual,
    renderTitle: vi.fn(),
    spinner: {
      start: vi.fn(),
      stop: vi.fn(),
    },
  };
});

vi.mock("../../../../src/infrastructure", () => ({
  writeJsonReport: vi.fn(),
}));

vi.mock("../../../../src/features/check/diagnostics", () => ({
  collectDiagnostics: vi.fn(),
  groupDiagnostics: vi.fn(),
}));

vi.mock("../../../../src/features/check/filter-usages-by-config", () => ({
  filterUsagesByConfig: vi.fn(),
}));

vi.mock("../../../../src/features/check/load-source-files", () => ({
  loadSourceFiles: vi.fn(),
}));

vi.mock("../../../../src/features/check/render-config-summary", () => ({
  renderConfigSummary: vi.fn(),
}));

describe("check", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("collects diagnostics per config and renders human output", async () => {
    vi.mocked(prepareSchema).mockResolvedValue({
      defaultEntry: { id: "web" } as any,
      schemaEntries: [
        { id: "web", shapes: { messages: "m1" } },
        { id: "admin", shapes: { messages: "m2" } },
      ] as any,
    });
    vi.mocked(loadSourceFiles).mockReturnValue(["a.ts"] as any);
    vi.mocked(extractUsages).mockReturnValue({ key: [] } as any);
    vi.mocked(filterUsagesByConfig)
      .mockReturnValueOnce({ id: "webScoped" } as any)
      .mockReturnValueOnce({ id: "adminScoped" } as any);
    vi.mocked(collectDiagnostics)
      .mockReturnValueOnce([{ code: "D1" }] as any)
      .mockReturnValueOnce([{ code: "D2" }] as any);
    vi.mocked(groupDiagnostics)
      .mockReturnValueOnce([{ id: "G1" }] as any)
      .mockReturnValueOnce([{ id: "G2" }] as any);

    await check({});

    expect(renderTitle).toHaveBeenCalledWith(FEATURES.check.title, true);
    expect(spinner.start).toHaveBeenCalledTimes(1);
    expect(spinner.stop).toHaveBeenCalledTimes(1);
    expect(loadSourceFiles).toHaveBeenCalledWith("tsconfig.json", false);
    expect(extractUsages).toHaveBeenCalledWith({
      sourceFiles: ["a.ts"],
      debug: false,
    });
    expect(filterUsagesByConfig).toHaveBeenNthCalledWith(1, {
      usages: { key: [] },
      defaultConfigKey: "web",
      configKey: "web",
    });
    expect(filterUsagesByConfig).toHaveBeenNthCalledWith(2, {
      usages: { key: [] },
      defaultConfigKey: "web",
      configKey: "admin",
    });
    expect(renderConfigSummary).toHaveBeenNthCalledWith(
      1,
      "web",
      [{ id: "G1" }],
      true,
    );
    expect(renderConfigSummary).toHaveBeenNthCalledWith(
      2,
      "admin",
      [{ id: "G2" }],
      true,
    );
    expect(writeJsonReport).not.toHaveBeenCalled();
  });

  it("writes a json report when json format is requested", async () => {
    vi.mocked(prepareSchema).mockResolvedValue({
      defaultEntry: { id: "web" } as any,
      schemaEntries: [{ id: "web", shapes: {} }] as any,
    });
    vi.mocked(loadSourceFiles).mockReturnValue(["a.ts"] as any);
    vi.mocked(extractUsages).mockReturnValue({ key: [] } as any);
    vi.mocked(filterUsagesByConfig).mockReturnValue({ scoped: true } as any);
    vi.mocked(collectDiagnostics).mockReturnValue([{ code: "D1" }] as any);
    vi.mocked(groupDiagnostics).mockReturnValue([{ id: "G1" }] as any);

    await check({ format: "json", output: "report.json", debug: true });

    expect(renderTitle).toHaveBeenCalledWith(FEATURES.check.title, false);
    expect(spinner.start).not.toHaveBeenCalled();
    expect(spinner.stop).not.toHaveBeenCalled();
    expect(loadSourceFiles).toHaveBeenCalledWith("tsconfig.json", true);
    expect(extractUsages).toHaveBeenCalledWith({
      sourceFiles: ["a.ts"],
      debug: true,
    });
    expect(renderConfigSummary).toHaveBeenCalledWith(
      "web",
      [{ id: "G1" }],
      false,
    );
    expect(writeJsonReport).toHaveBeenCalledWith(
      { configs: [{ id: "web", diagnostics: [{ code: "D1" }] }] },
      "report.json",
    );
  });

  it("throws when no source files are found", async () => {
    vi.mocked(prepareSchema).mockResolvedValue({
      defaultEntry: { id: "web" } as any,
      schemaEntries: [] as any,
    });
    vi.mocked(loadSourceFiles).mockReturnValue([]);

    await expect(check({})).rejects.toThrow(
      [
        "No source files found.",
        "",
        "Check the following:",
        "  - tsconfig.json path",
        "  - project root",
        "  - included source patterns",
      ].join("\n"),
    );
    expect(spinner.stop).toHaveBeenCalledTimes(2);
  });

  it("throws non-Error failures", async () => {
    vi.mocked(prepareSchema).mockRejectedValue("boom");

    await expect(check({ format: "json" })).rejects.toBe("boom");
  });
});
