import type { NamespaceMessages } from "@/modules/messages/types";
import fs from "node:fs/promises";
import { describe, it, expect, vi } from "vitest";
import { jsonReader } from "@/modules/messages/load-local-messages/read-locale-messages/parse-file-entries/utils/json-reader";

vi.mock("node:fs/promises");

describe("jsonReader", () => {
  const mockReadFile = fs.readFile;

  it("should read and parse a valid JSON file", async () => {
    const filePath = "/path/to/file.json";
    const mockData: NamespaceMessages = { hello: "world" };
    vi.mocked(mockReadFile).mockResolvedValueOnce(JSON.stringify(mockData));

    const result = await jsonReader(filePath);
    expect(result).toEqual(mockData);
  });

  it("should throw if JSON is invalid", async () => {
    const filePath = "/path/to/invalid.json";
    vi.mocked(mockReadFile).mockResolvedValueOnce("invalid json");

    await expect(jsonReader(filePath)).rejects.toThrow(SyntaxError);
  });

  it("should throw if parsed JSON does not match NamespaceMessages", async () => {
    const filePath = "/path/to/bad-structure.json";
    const badData = { notValid: 123 };
    vi.mocked(mockReadFile).mockResolvedValueOnce(JSON.stringify(badData));

    await expect(jsonReader(filePath)).rejects.toThrow(
      "JSON file does not match NamespaceMessages structure",
    );
  });

  it("should allow injecting a custom readFile function", async () => {
    const customReadFile = vi
      .fn()
      .mockResolvedValue(JSON.stringify({ foo: "bar" }));
    const result = await jsonReader("/any/path", customReadFile);
    expect(result).toEqual({ foo: "bar" });
    expect(customReadFile).toHaveBeenCalled();
  });
});
