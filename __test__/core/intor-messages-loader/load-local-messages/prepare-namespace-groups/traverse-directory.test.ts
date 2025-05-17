import type { PrepareNamespaceGroupsOptions } from "../../../../../src/intor/core/intor-messages-loader/load-local-messages/prepare-namespace-groups";
import type pLimit from "p-limit";
import fs from "node:fs/promises";
import path from "node:path";
import { mockIntorLogger } from "../../../../mock/mock-intor-logger";
import { addToNamespaceGroup } from "../../../../../src/intor/core/intor-messages-loader/load-local-messages/prepare-namespace-groups";
import { traverseDirectory } from "../../../../../src/intor/core/intor-messages-loader/load-local-messages/prepare-namespace-groups/traverse-directory";

jest.mock(
  "../../../../../src/intor/core/intor-messages-loader/load-local-messages/prepare-namespace-groups",
  () => ({ addToNamespaceGroup: jest.fn() }),
);
jest.mock("node:fs/promises");
const mockAddToNamespaceGroup = addToNamespaceGroup as jest.Mock;
const mockReaddir = fs.readdir as jest.Mock;
const { mockLogger, mockLogWarn } = mockIntorLogger();

describe("traverseDirectory", () => {
  const basePath = "/mock/locales";
  const namespaceGroups = new Map();
  const options = {
    logger: mockLogger,
    limit: async <T>(fn: () => Promise<T>) => await fn(),
  } as unknown as PrepareNamespaceGroupsOptions;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("adds a .json file to the namespace group", async () => {
    mockReaddir.mockResolvedValue([
      {
        name: "common.json",
        isFile: () => true,
        isDirectory: () => false,
      },
    ]);

    await traverseDirectory({
      currentDirPath: basePath,
      namespaceGroups,
      namespacePathSegments: ["common"],
      options,
    });

    expect(mockAddToNamespaceGroup).toHaveBeenCalledWith({
      namespaceGroups,
      filePath: path.join(basePath, "common.json"),
      namespacePathSegments: ["common"],
      options,
    });
  });

  it("should catch errors when processing a directory", async () => {
    (fs.readdir as jest.Mock).mockRejectedValue(
      new Error("Directory read error"),
    );

    await traverseDirectory({
      options,
      currentDirPath: "/invalid/path",
      namespaceGroups: new Map(),
      namespacePathSegments: [],
    });

    expect(mockLogWarn).toHaveBeenCalledWith(
      `Error reading directory: /invalid/path`,
      expect.objectContaining({
        error: expect.objectContaining({
          message: "Directory read error",
        }),
      }),
    );
  });

  it("should catch errors inside limit processing", async () => {
    (fs.readdir as jest.Mock).mockResolvedValue([
      { name: "invalid.json", isFile: () => true, isDirectory: () => false },
    ]);

    jest.mocked(addToNamespaceGroup).mockImplementationOnce(() => {
      throw new Error("Error processing file");
    });

    await traverseDirectory({
      options,
      currentDirPath: "/valid/path",
      namespaceGroups: new Map(),
      namespacePathSegments: [],
    });

    expect(mockLogWarn).toHaveBeenCalledWith(
      "Failed to process a locale file or directory.",
      expect.objectContaining({
        name: "invalid.json",
        type: "file",
        path: "/valid/path",
        error: expect.objectContaining({ message: "Error processing file" }),
      }),
    );
  });

  it("should recursively traverse directories and process JSON files", async () => {
    (fs.readdir as jest.Mock).mockImplementation((dirPath: string) => {
      if (dirPath === "/valid/path") {
        return Promise.resolve([
          { name: "subfolder", isFile: () => false, isDirectory: () => true },
        ]);
      }

      if (dirPath === "/valid/path/subfolder") {
        return Promise.resolve([
          { name: "sub.json", isFile: () => true, isDirectory: () => false },
        ]);
      }

      return Promise.resolve([]);
    });

    await traverseDirectory({
      options,
      currentDirPath: "/valid/path",
      namespaceGroups: new Map(),
      namespacePathSegments: [],
    });

    expect(addToNamespaceGroup).toHaveBeenCalledWith(
      expect.objectContaining({
        filePath: "/valid/path/subfolder/sub.json",
        namespacePathSegments: ["subfolder"],
      }),
    );
  });

  it("should log error with type 'directory' if directory traversal throws", async () => {
    (fs.readdir as jest.Mock).mockResolvedValue([
      { name: "subdir", isFile: () => false, isDirectory: () => true },
    ]);

    // eslint-disable-next-line @typescript-eslint/require-await
    const fakeLimit = jest.fn().mockImplementation(async () => {
      throw new Error("error during recursion");
    });

    await traverseDirectory({
      options: {
        ...options,
        limit: fakeLimit as unknown as ReturnType<typeof pLimit>,
      },
      currentDirPath: "/valid/path",
      namespaceGroups: new Map(),
      namespacePathSegments: [],
    });

    expect(mockLogWarn).toHaveBeenCalledWith(
      "Failed to process a locale file or directory.",
      expect.objectContaining({
        name: "subdir",
        type: "directory",
        path: "/valid/path",
      }),
    );
  });
});
