import type {
  NamespaceGroupValue,
  PrepareNamespaceGroupsOptions,
} from "../../../../../src/intor/core/intor-messages-loader/load-local-messages/prepare-namespace-groups/prepare-namespace-groups";
import { addToNamespaceGroup } from "../../../../../src/intor/core/intor-messages-loader/load-local-messages/prepare-namespace-groups";

describe("addToNamespaceGroup", () => {
  let namespaceGroups: Map<string, NamespaceGroupValue>;
  let namespaces: Set<string>;

  beforeEach(() => {
    namespaceGroups = new Map();
    namespaces = new Set();
  });

  it("should add a new file path when it does not exist in the group", () => {
    const filePath = "/path/to/file.json";
    const namespacePathSegments: string[] = [];
    const options = { namespaces } as PrepareNamespaceGroupsOptions;

    addToNamespaceGroup({
      options,
      filePath,
      namespaceGroups,
      namespacePathSegments,
    });

    expect(namespaceGroups.size).toBe(1);
    const group = namespaceGroups.get("file")!;
    expect(group.filePaths).toEqual([filePath]);
  });

  it("should not add the same file path again to the group", () => {
    const filePath = "/path/to/file.json";
    const namespacePathSegments: string[] = [];
    const options = { namespaces } as PrepareNamespaceGroupsOptions;

    addToNamespaceGroup({
      options,
      filePath,
      namespaceGroups,
      namespacePathSegments,
    });

    addToNamespaceGroup({
      options,
      filePath,
      namespaceGroups,
      namespacePathSegments,
    });

    const group = namespaceGroups.get("file")!;
    expect(group.filePaths).toEqual([filePath]);
  });

  it("should add file path to a nested namespace group", () => {
    const filePath = "/path/to/sub/file.json";
    const namespacePathSegments = ["sub"];
    const options = { namespaces } as PrepareNamespaceGroupsOptions;

    addToNamespaceGroup({
      options,
      filePath,
      namespaceGroups,
      namespacePathSegments,
    });

    const group = namespaceGroups.get("sub")!;
    expect(group.filePaths).toEqual([filePath]);
  });

  it("should not add file if namespace is not in the allowed namespaces", () => {
    const filePath = "/path/to/file.json";
    const namespacePathSegments: string[] = [];
    namespaces.add("allowedNamespace");
    const options = { namespaces } as PrepareNamespaceGroupsOptions;

    addToNamespaceGroup({
      options,
      filePath,
      namespaceGroups,
      namespacePathSegments,
    });

    expect(namespaceGroups.size).toBe(0);
  });

  it("should add file paths to a group with multiple files", () => {
    const filePath1 = "/path/to/file1.json";
    const filePath2 = "/path/to/file2.json";
    const namespacePathSegments: string[] = [];
    const options = { namespaces } as PrepareNamespaceGroupsOptions;

    addToNamespaceGroup({
      options,
      filePath: filePath1,
      namespaceGroups,
      namespacePathSegments,
    });
    addToNamespaceGroup({
      options,
      filePath: filePath2,
      namespaceGroups,
      namespacePathSegments,
    });

    const group1 = namespaceGroups.get("file1")!;
    const group2 = namespaceGroups.get("file2")!;

    expect(group1.filePaths).toEqual([filePath1]);
    expect(group2.filePaths).toEqual([filePath2]);
  });

  it("should not add duplicate file paths in the same group", () => {
    const filePath = "/path/to/file.json";
    const namespacePathSegments: string[] = [];
    const options = { namespaces } as PrepareNamespaceGroupsOptions;

    addToNamespaceGroup({
      options,
      filePath,
      namespaceGroups,
      namespacePathSegments,
    });
    addToNamespaceGroup({
      options,
      filePath,
      namespaceGroups,
      namespacePathSegments,
    });

    const group = namespaceGroups.get("file")!;
    expect(group.filePaths).toEqual([filePath]);
  });

  it("should not add empty file paths", () => {
    const filePath = "";
    const namespacePathSegments: string[] = [];
    const options = { namespaces } as PrepareNamespaceGroupsOptions;

    addToNamespaceGroup({
      options,
      filePath,
      namespaceGroups,
      namespacePathSegments,
    });

    expect(namespaceGroups.size).toBe(0);
  });

  it("should not add null or undefined file paths", () => {
    const filePaths: (string | null | undefined)[] = [null, undefined];
    const namespacePathSegments: string[] = [];
    const options = { namespaces } as PrepareNamespaceGroupsOptions;

    filePaths.forEach((filePath) => {
      addToNamespaceGroup({
        options,
        filePath: filePath!,
        namespaceGroups,
        namespacePathSegments,
      });

      expect(namespaceGroups.size).toBe(0);
    });
  });

  it("should correctly handle file paths with special characters", () => {
    const filePath = "/path/to/file with spaces.json";
    const namespacePathSegments: string[] = [];
    const options = { namespaces } as PrepareNamespaceGroupsOptions;

    addToNamespaceGroup({
      options,
      filePath,
      namespaceGroups,
      namespacePathSegments,
    });

    const group = namespaceGroups.get("file with spaces")!;
    expect(group.filePaths).toEqual([filePath]);
  });

  it("should not add duplicate namespace", () => {
    const filePath = "/path/to/file.json";
    const namespacePathSegments: string[] = ["file"];
    const options = { namespaces } as PrepareNamespaceGroupsOptions;

    addToNamespaceGroup({
      options,
      filePath,
      namespaceGroups,
      namespacePathSegments,
    });

    addToNamespaceGroup({
      options,
      filePath,
      namespaceGroups,
      namespacePathSegments,
    });

    const group = namespaceGroups.get("file")!;
    expect(group.filePaths).toEqual([filePath]);
  });

  it("should create a new namespace when it does not exist", () => {
    const filePath = "/path/to/file.json";
    const namespacePathSegments: string[] = ["newNamespace"];
    const options = { namespaces } as PrepareNamespaceGroupsOptions;

    addToNamespaceGroup({
      options,
      filePath,
      namespaceGroups,
      namespacePathSegments,
    });

    const group = namespaceGroups.get("newNamespace")!;
    expect(group.filePaths).toEqual([filePath]);
  });

  it("should handle nested namespace paths", () => {
    const filePath = "/path/to/sub/file.json";
    const namespacePathSegments = ["root", "sub"];
    const options = { namespaces } as PrepareNamespaceGroupsOptions;

    addToNamespaceGroup({
      options,
      filePath,
      namespaceGroups,
      namespacePathSegments,
    });

    const group = namespaceGroups.get("root.sub")!;
    expect(group.filePaths).toEqual([filePath]);
  });
});
