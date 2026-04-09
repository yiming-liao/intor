import fs from "node:fs/promises";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ensureDirAndWriteFile } from "../../../src/infrastructure/ensure-dir-and-write-file";

vi.mock("node:fs/promises", () => ({
  default: {
    mkdir: vi.fn(),
    writeFile: vi.fn(),
  },
}));

describe("ensureDirAndWriteFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates the parent directory before writing the file", async () => {
    await ensureDirAndWriteFile("artifacts/schema/report.json", "hello");

    expect(fs.mkdir).toHaveBeenCalledWith("artifacts/schema", {
      recursive: true,
    });
    expect(fs.writeFile).toHaveBeenCalledWith(
      "artifacts/schema/report.json",
      "hello",
      "utf8",
    );
  });

  it("rethrows mkdir failures and skips writing the file", async () => {
    vi.mocked(fs.mkdir).mockRejectedValueOnce(new Error("mkdir failed"));

    await expect(
      ensureDirAndWriteFile("artifacts/schema/report.json", "hello"),
    ).rejects.toThrow("mkdir failed");

    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it("rethrows write failures after creating the directory", async () => {
    vi.mocked(fs.writeFile).mockRejectedValueOnce(new Error("write failed"));

    await expect(
      ensureDirAndWriteFile("artifacts/schema/report.json", "hello"),
    ).rejects.toThrow("write failed");

    expect(fs.mkdir).toHaveBeenCalledWith("artifacts/schema", {
      recursive: true,
    });
  });
});
