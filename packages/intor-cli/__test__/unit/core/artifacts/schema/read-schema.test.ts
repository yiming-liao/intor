import fs from "node:fs/promises";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readSchema } from "../../../../../src/core/artifacts/schema/read-schema";
import { DEFAULT_SCHEMA_FILE_PATH } from "../../../../../src/shared";

vi.mock("node:fs/promises", () => ({
  default: {
    readFile: vi.fn(),
  },
}));

describe("readSchema", () => {
  const readFileMock = vi.mocked(fs.readFile);

  beforeEach(() => {
    readFileMock.mockReset();
  });

  it("reads and parses generated schema", async () => {
    readFileMock.mockResolvedValue(
      JSON.stringify({
        version: 1,
        toolVersion: "0.0.21",
        entries: [],
      }),
    );

    const schema = await readSchema();

    expect(readFileMock).toHaveBeenCalledWith(DEFAULT_SCHEMA_FILE_PATH, "utf8");
    expect(schema).toEqual({
      version: 1,
      toolVersion: "0.0.21",
      entries: [],
    });
  });

  it("throws helpful error when schema file is missing", async () => {
    readFileMock.mockRejectedValue(new Error("ENOENT"));

    await expect(readSchema()).rejects.toThrow(
      `Failed to read Intor schema file at "${DEFAULT_SCHEMA_FILE_PATH}".`,
    );
  });

  it("throws helpful error when schema json is invalid", async () => {
    readFileMock.mockResolvedValue("{");

    await expect(readSchema()).rejects.toThrow(
      `Invalid JSON format in Intor schema file at "${DEFAULT_SCHEMA_FILE_PATH}".`,
    );
  });
});
