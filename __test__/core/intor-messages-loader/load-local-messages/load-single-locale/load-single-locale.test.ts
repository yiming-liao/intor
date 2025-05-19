import type { LocaleNamespaceMessages } from "../../../../../src/intor/types/message-structure-types";
import type pLimit from "p-limit";
import fs from "node:fs/promises";
import { loadNamespaceGroup } from "../../../../../src/intor/core/intor-messages-loader/load-local-messages/load-namespace-group";
import { loadSingleLocale } from "../../../../../src/intor/core/intor-messages-loader/load-local-messages/load-single-locale";
import { prepareNamespaceGroups } from "../../../../../src/intor/core/intor-messages-loader/load-local-messages/prepare-namespace-groups";
import { mockIntorLogger } from "../../../../mock/mock-intor-logger";

jest.mock("node:fs/promises");
jest.mock(
  "../../../../../src/intor/core/intor-messages-loader/load-local-messages/prepare-namespace-groups",
);
jest.mock(
  "../../../../../src/intor/core/intor-messages-loader/load-local-messages/load-namespace-group",
);

describe("loadSingleLocale", () => {
  const basePath = "/test/base";
  const locale = "en";
  const fullLocalePath = `${basePath}/${locale}`;
  const namespaces = ["ns1", "ns2"];
  const messages: LocaleNamespaceMessages = {};
  const mockLimit = jest.fn() as unknown as ReturnType<typeof pLimit>;
  const { mockLogger, mockLogDebug, mockLogWarn } = mockIntorLogger();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should load locale successfully", async () => {
    (fs.stat as jest.Mock).mockResolvedValue({ isDirectory: () => true });

    const namespaceGroups = new Map([
      ["ns1", { isAtRoot: true, filePaths: ["file1.json"] }],
      ["ns2", { isAtRoot: false, filePaths: ["file2.json"] }],
    ]);

    (prepareNamespaceGroups as jest.Mock).mockResolvedValue(namespaceGroups);
    (loadNamespaceGroup as jest.Mock).mockResolvedValue(undefined);

    const result = await loadSingleLocale({
      basePath,
      locale,
      namespaces,
      messages,
      limit: mockLimit,
      logger: mockLogger,
    });

    expect(fs.stat).toHaveBeenCalledWith(fullLocalePath);
    expect(prepareNamespaceGroups).toHaveBeenCalledWith({
      basePath: fullLocalePath,
      limit: mockLimit,
      namespaces: new Set(namespaces),
      logger: expect.anything(),
    });

    expect(loadNamespaceGroup).toHaveBeenCalledTimes(2);
    expect(result).toEqual(["ns1", "ns2"]);
    expect(mockLogDebug).toHaveBeenCalled();
  });

  it("should warn and return undefined if localePath is not a directory", async () => {
    (fs.stat as jest.Mock).mockResolvedValue({ isDirectory: () => false });

    const result = await loadSingleLocale({
      basePath,
      locale,
      messages,
      limit: mockLimit,
      logger: mockLogger,
    });

    expect(mockLogWarn).toHaveBeenCalledWith(
      "Locale path is not a directory.",
      {
        locale,
        path: fullLocalePath,
      },
    );
    expect(result).toBeUndefined();
  });

  it("should warn and return undefined if fs.stat throws error", async () => {
    (fs.stat as jest.Mock).mockRejectedValue(new Error("FS Error"));

    const result = await loadSingleLocale({
      basePath,
      locale,
      messages,
      limit: mockLimit,
      logger: mockLogger,
    });

    expect(mockLogWarn).toHaveBeenCalledWith("Error checking locale path:", {
      locale,
      error: expect.any(Error),
    });
    expect(result).toBeUndefined();
  });

  it("should warn and return undefined if no namespace groups found", async () => {
    (fs.stat as jest.Mock).mockResolvedValue({ isDirectory: () => true });
    (prepareNamespaceGroups as jest.Mock).mockResolvedValue(new Map());

    const result = await loadSingleLocale({
      basePath,
      locale,
      messages,
      limit: mockLimit,
      logger: mockLogger,
    });

    expect(mockLogWarn).toHaveBeenCalledWith("No namespace groups found.", {
      locale,
      basePath,
      namespaces: undefined,
    });
    expect(result).toBeUndefined();
  });

  it("should only load specified namespaces if given", async () => {
    (fs.stat as jest.Mock).mockResolvedValue({ isDirectory: () => true });

    const namespaceGroups = new Map([
      ["ns1", { isAtRoot: true, filePaths: ["file1.json"] }],
      ["other", { isAtRoot: false, filePaths: ["file3.json"] }],
    ]);

    (prepareNamespaceGroups as jest.Mock).mockResolvedValue(namespaceGroups);
    (loadNamespaceGroup as jest.Mock).mockResolvedValue(undefined);

    const result = await loadSingleLocale({
      basePath,
      locale,
      namespaces: ["ns1"], // 只要 ns1
      messages,
      limit: mockLimit,
      logger: mockLogger,
    });

    expect(loadNamespaceGroup).toHaveBeenCalledTimes(1);
    expect(loadNamespaceGroup).toHaveBeenCalledWith(
      expect.objectContaining({
        namespace: "ns1",
      }),
    );

    expect(result).toEqual(["ns1"]);
  });

  it("should load all namespaces if none are specified", async () => {
    (fs.stat as jest.Mock).mockResolvedValue({ isDirectory: () => true });

    const namespaceGroups = new Map([
      ["ns1", { isAtRoot: true, filePaths: ["file1.json"] }],
      ["ns2", { isAtRoot: true, filePaths: ["file2.json"] }],
    ]);

    (prepareNamespaceGroups as jest.Mock).mockResolvedValue(namespaceGroups);
    (loadNamespaceGroup as jest.Mock).mockResolvedValue(undefined);

    const result = await loadSingleLocale({
      basePath,
      locale,
      messages,
      limit: mockLimit,
      logger: mockLogger,
    });

    expect(loadNamespaceGroup).toHaveBeenCalledTimes(2);
    expect(result).toEqual(["ns1", "ns2"]);
  });

  it("should work without logger", async () => {
    (fs.stat as jest.Mock).mockResolvedValue({ isDirectory: () => true });

    const namespaceGroups = new Map([
      ["ns1", { isAtRoot: true, filePaths: ["file1.json"] }],
    ]);

    (prepareNamespaceGroups as jest.Mock).mockResolvedValue(namespaceGroups);
    (loadNamespaceGroup as jest.Mock).mockResolvedValue(undefined);

    const result = await loadSingleLocale({
      basePath,
      locale,
      messages,
      limit: mockLimit,
    });

    expect(loadNamespaceGroup).toHaveBeenCalledTimes(1);
    expect(result).toEqual(["ns1"]);
  });
});
