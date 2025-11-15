import { describe, it, expect } from "vitest";
import { addToNamespaceGroup } from "@/modules/messages/load-local-messages/prepare-namespace-groups/add-to-namespace-group";

describe("addToNamespaceGroup", () => {
  it("does nothing when filePath is empty", () => {
    const groups = new Map();
    addToNamespaceGroup({
      // @ts-expect-error ignore options
      options: { namespaces: new Set() },
      filePath: "",
      namespaceGroups: groups,
      namespacePathSegments: [],
    });
    expect(groups.size).toBe(0);
  });

  it("uses file name as namespace at root", () => {
    const groups = new Map();
    addToNamespaceGroup({
      // @ts-expect-error ignore options
      options: { namespaces: new Set() },
      filePath: "/path/to/messages.json",
      namespaceGroups: groups,
      namespacePathSegments: [],
    });
    expect(groups.has("messages")).toBe(true);
    expect(groups.get("messages")!.filePaths).toContain(
      "/path/to/messages.json",
    );
  });

  it("uses joined segments as namespace for nested paths", () => {
    const groups = new Map();
    addToNamespaceGroup({
      // @ts-expect-error ignore options
      options: { namespaces: new Set() },
      filePath: "/path/to/file.json",
      namespaceGroups: groups,
      namespacePathSegments: ["level1", "level2"],
    });
    expect(groups.has("level1.level2")).toBe(true);
    expect(groups.get("level1.level2")!.filePaths).toContain(
      "/path/to/file.json",
    );
  });

  it("skips namespaces not in the target set", () => {
    const groups = new Map();
    addToNamespaceGroup({
      // @ts-expect-error ignore options
      options: { namespaces: new Set(["allowed"]) },
      filePath: "/path/to/file.json",
      namespaceGroups: groups,
      namespacePathSegments: ["notallowed"],
    });
    expect(groups.size).toBe(0);
  });

  it("does not duplicate file paths", () => {
    const groups = new Map();
    addToNamespaceGroup({
      // @ts-expect-error ignore options
      options: { namespaces: new Set() },
      filePath: "/file.json",
      namespaceGroups: groups,
      namespacePathSegments: [],
    });
    addToNamespaceGroup({
      // @ts-expect-error ignore options
      options: { namespaces: new Set() },
      filePath: "/file.json",
      namespaceGroups: groups,
      namespacePathSegments: [],
    });
    expect(groups.get("file")!.filePaths.length).toBe(1);
  });
});
