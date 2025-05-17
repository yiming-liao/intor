import type { IntorLogger } from "../../../../../src/intor/core/intor-logger/intor-logger";
import { parseMessageFile } from "../../../../../src/intor/core/intor-messages-loader/load-local-messages/load-namespace-group/parse-message-file";
import { readMessageRecordFile } from "../../../../../src/intor/core/intor-messages-loader/load-local-messages/utils/read-message-record-file";

jest.mock(
  "../../../../../src/intor/core/intor-messages-loader/load-local-messages/utils/read-message-record-file",
);

describe("parseMessageFile", () => {
  const mockLogWarn = jest.fn();
  const mockLogDebug = jest.fn();
  const mockLogger = {
    child: jest.fn().mockReturnValue({
      warn: mockLogWarn,
      debug: mockLogDebug,
    }),
  } as unknown as IntorLogger;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return parsed content if the file is a valid JSON", async () => {
    const mockContent = { hello: "world" };
    const mockFilePath = "/mock/path/messages.json";

    (readMessageRecordFile as jest.Mock).mockResolvedValue({
      content: mockContent,
    });

    const result = await parseMessageFile(mockFilePath, mockLogger);

    expect(result).toEqual(mockContent);
    expect(mockLogDebug).toHaveBeenCalledWith("Loaded a file.", {
      filePath: mockFilePath,
    });
  });

  it("should return null and log a warning if the file path is invalid", async () => {
    const mockFilePath = "  ";

    const result = await parseMessageFile(mockFilePath, mockLogger);

    expect(result).toBeNull();
    expect(mockLogWarn).toHaveBeenCalledWith("Invalid file path provided.", {
      filePath: "",
    });
  });

  it("should return null if the file is not a JSON", async () => {
    const mockFilePath = "/mock/path/messages.txt";

    const result = await parseMessageFile(mockFilePath, mockLogger);

    expect(result).toBeNull();
    expect(mockLogDebug).toHaveBeenCalledWith("Skipped non-JSON file.", {
      filePath: mockFilePath,
    });
  });

  it("should return null and log a warning if reading the file fails", async () => {
    const mockFilePath = "/mock/path/messages.json";

    (readMessageRecordFile as jest.Mock).mockRejectedValue(
      new Error("File read error"),
    );

    const result = await parseMessageFile(mockFilePath, mockLogger);

    expect(result).toBeNull();
    expect(mockLogWarn).toHaveBeenCalledWith("Failed to load file.", {
      filePath: mockFilePath,
      error: expect.any(Error),
    });
  });

  // Edge case: File path with special characters
  it("should correctly handle file paths with special characters", async () => {
    const mockFilePath = "/mock/path/消息文件.json";

    const mockContent = { hello: "world" };
    (readMessageRecordFile as jest.Mock).mockResolvedValue({
      content: mockContent,
    });

    const result = await parseMessageFile(mockFilePath, mockLogger);

    expect(result).toEqual(mockContent);
    expect(mockLogDebug).toHaveBeenCalledWith("Loaded a file.", {
      filePath: mockFilePath,
    });
  });

  // Edge case: Very long file path
  it("should return null and log a warning if the file path is too long", async () => {
    const longPath = "/mock/path/".repeat(50) + "messages.json";

    const result = await parseMessageFile(longPath, mockLogger);

    expect(result).toBeNull();
    expect(mockLogWarn).toHaveBeenCalledWith("Invalid file path provided.", {
      filePath: longPath,
    });
  });

  // Edge case: Empty JSON file
  it("should return null if the JSON file is empty", async () => {
    const mockFilePath = "/mock/path/empty-file.json";
    const mockContent = {};

    (readMessageRecordFile as jest.Mock).mockResolvedValue({
      content: mockContent,
    });

    const result = await parseMessageFile(mockFilePath, mockLogger);

    expect(result).toEqual(mockContent); // It's a valid empty JSON
    expect(mockLogDebug).toHaveBeenCalledWith("Loaded a file.", {
      filePath: mockFilePath,
    });
  });

  // Edge case: Non-JSON content inside a non-JSON file
  it("should return null if the file contains valid JSON but isn't a JSON file", async () => {
    const mockFilePath = "/mock/path/messages.txt";
    const invalidJsonContent = '{"hello": "world"}';

    (readMessageRecordFile as jest.Mock).mockResolvedValue({
      content: JSON.parse(invalidJsonContent),
    });

    const result = await parseMessageFile(mockFilePath, mockLogger);

    expect(result).toBeNull();
    expect(mockLogDebug).toHaveBeenCalledWith("Skipped non-JSON file.", {
      filePath: mockFilePath,
    });
  });

  // Edge case: File path with backslashes (Windows-style paths)
  it("should correctly handle Windows-style file paths", async () => {
    const mockFilePath = "C:\\mock\\path\\messages.json";

    const mockContent = { hello: "world" };
    (readMessageRecordFile as jest.Mock).mockResolvedValue({
      content: mockContent,
    });

    const result = await parseMessageFile(mockFilePath, mockLogger);

    expect(result).toEqual(mockContent);
    expect(mockLogDebug).toHaveBeenCalledWith("Loaded a file.", {
      filePath: mockFilePath,
    });
  });

  // Edge case: Multiple calls to parseMessageFile
  it("should handle multiple calls correctly", async () => {
    const mockFilePath1 = "/mock/path/messages1.json";
    const mockFilePath2 = "/mock/path/messages2.json";
    const mockContent1 = { hello: "world" };
    const mockContent2 = { goodbye: "world" };

    (readMessageRecordFile as jest.Mock).mockResolvedValueOnce({
      content: mockContent1,
    });
    (readMessageRecordFile as jest.Mock).mockResolvedValueOnce({
      content: mockContent2,
    });

    const result1 = await parseMessageFile(mockFilePath1, mockLogger);
    const result2 = await parseMessageFile(mockFilePath2, mockLogger);

    expect(result1).toEqual(mockContent1);
    expect(result2).toEqual(mockContent2);
    expect(mockLogDebug).toHaveBeenCalledTimes(2); // Ensures both calls logged
  });
});
