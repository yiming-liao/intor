import fs from "node:fs/promises";
import path from "node:path";
import { readMessageRecordFile } from "../../../../../src/intor/core/intor-messages-loader/load-local-messages/utils/read-message-record-file";

jest.mock("node:fs/promises", () => ({
  ...jest.requireActual("node:fs/promises"),
  readFile: jest.fn(),
}));

describe("readMessageRecordFile", () => {
  const filePath = path.join(__dirname, "mock", "messages.json");
  const mockFileName = "messages";
  const mockContent = { key: "value" };

  it("should successfully read and parse a valid JSON file", async () => {
    (fs.readFile as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(mockContent),
    );

    const result = await readMessageRecordFile(filePath);

    expect(result).toEqual({ fileName: mockFileName, content: mockContent });
    expect(fs.readFile).toHaveBeenCalledWith(filePath, "utf-8");
  });

  it("should throw an error if the file content is not a valid JSON object", async () => {
    const invalidContent = "invalid content";

    (fs.readFile as jest.Mock).mockResolvedValueOnce(invalidContent);

    await expect(readMessageRecordFile(filePath)).rejects.toThrow();
  });

  it("should throw an error if the JSON content is not an object", async () => {
    const invalidJson = JSON.stringify("string instead of object");

    (fs.readFile as jest.Mock).mockResolvedValueOnce(invalidJson);

    await expect(readMessageRecordFile(filePath)).rejects.toThrow();
  });

  it("should throw an error if the file content is empty", async () => {
    const emptyContent = "";

    (fs.readFile as jest.Mock).mockResolvedValueOnce(emptyContent);

    await expect(readMessageRecordFile(filePath)).rejects.toThrow();
  });

  it("should throw an error if there is an issue reading the file", async () => {
    const errorMessage = "File not found";

    (fs.readFile as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await expect(readMessageRecordFile(filePath)).rejects.toThrow(errorMessage);
  });

  it("should throw an error if JSON content is null", async () => {
    const nullJson = JSON.stringify(null);

    (fs.readFile as jest.Mock).mockResolvedValueOnce(nullJson);

    await expect(readMessageRecordFile(filePath)).rejects.toThrow();
  });
});
