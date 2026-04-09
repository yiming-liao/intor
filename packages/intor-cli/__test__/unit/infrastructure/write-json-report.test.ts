import { beforeEach, describe, expect, it, vi } from "vitest";
import { writeFile } from "node:fs/promises";
import { writeJsonReport } from "../../../src/infrastructure/write-json-report";

vi.mock("node:fs/promises", () => ({
  writeFile: vi.fn(),
}));

describe("writeJsonReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("writes formatted json to a file when output is provided", async () => {
    await writeJsonReport({ hello: "world" }, "report.json");

    expect(writeFile).toHaveBeenCalledWith(
      "report.json",
      '{\n  "hello": "world"\n}',
      "utf8",
    );
  });

  it("writes formatted json to stdout when output is not provided", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await writeJsonReport({ hello: "world" });

    expect(logSpy).toHaveBeenCalledWith('{\n  "hello": "world"\n}');
    expect(writeFile).not.toHaveBeenCalled();

    logSpy.mockRestore();
  });

  it("writes undefined as json when the report is undefined", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await writeJsonReport(undefined);

    expect(logSpy).toHaveBeenCalledWith(undefined);

    logSpy.mockRestore();
  });
});
