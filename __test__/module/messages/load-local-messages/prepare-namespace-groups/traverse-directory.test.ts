/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PrepareNamespaceGroupsOptions } from "@/modules/messages/load-local-messages/prepare-namespace-groups";
import type fs from "node:fs/promises";
import type pLimit from "p-limit";
import type { LimitFunction } from "p-limit";
import { describe, it, vi, expect } from "vitest";
import { addToNamespaceGroup } from "@/modules/messages/load-local-messages/prepare-namespace-groups/add-to-namespace-group";
import { traverseDirectory } from "@/modules/messages/load-local-messages/prepare-namespace-groups/traverse-directory";

vi.mock(
  "@/modules/messages/load-local-messages/prepare-namespace-groups/add-to-namespace-group",
  () => ({
    addToNamespaceGroup: vi.fn(),
  }),
);

describe("traverseDirectory", () => {
  it("calls addToNamespaceGroup for JSON files", async () => {
    const mockReaddir = vi.fn(async (dir: string) => {
      if (dir === "/test") {
        return [
          { name: "file1.json", isFile: () => true, isDirectory: () => false },
          { name: "subdir", isFile: () => false, isDirectory: () => true },
        ];
      }
      if (dir === "/test/subdir") {
        return [
          { name: "file2.json", isFile: () => true, isDirectory: () => false },
        ];
      }
      return [];
    });

    const namespaceGroups = new Map<string, any>();

    const limitFn = (async <T>(fn: () => Promise<T>) => fn()) as ReturnType<
      typeof pLimit
    >;

    await traverseDirectory({
      currentDirPath: "/test",
      namespaceGroups,
      namespacePathSegments: [],
      options: {
        limit: limitFn,
        logger: { id: "test", level: "silent" },
      } as PrepareNamespaceGroupsOptions,
      readdir: mockReaddir as unknown as (typeof fs)["readdir"],
    });

    expect(addToNamespaceGroup).toHaveBeenCalledTimes(2);
    expect(addToNamespaceGroup).toHaveBeenCalledWith(
      expect.objectContaining({ filePath: "/test/file1.json" }),
    );
    expect(addToNamespaceGroup).toHaveBeenCalledWith(
      expect.objectContaining({ filePath: "/test/subdir/file2.json" }),
    );
  });

  it("handles readdir throwing error", async () => {
    const mockReaddir = vi.fn(async () => {
      throw new Error("readdir failed");
    });

    const namespaceGroups = new Map<string, any>();
    const limitFn = (async <T>(fn: () => Promise<T>) => fn()) as ReturnType<
      typeof pLimit
    >;

    await traverseDirectory({
      currentDirPath: "/error-dir",
      namespaceGroups,
      namespacePathSegments: [],
      options: {
        limit: limitFn,
        logger: { id: "test" },
      } as PrepareNamespaceGroupsOptions,
      readdir: mockReaddir as unknown as (typeof fs)["readdir"],
    });
  });

  it("handles limit throwing error inside directory traversal", async () => {
    const mockReaddir = vi.fn(async () => [
      { name: "file.json", isFile: () => true, isDirectory: () => false },
    ]);

    const namespaceGroups = new Map<string, any>();

    const limitFn = (async () => {
      throw new Error("limit failed");
    }) as unknown as LimitFunction;

    await traverseDirectory({
      currentDirPath: "/limit-dir",
      namespaceGroups,
      namespacePathSegments: [],
      options: {
        limit: limitFn,
        logger: { id: "test" },
      } as PrepareNamespaceGroupsOptions,
      readdir: mockReaddir as unknown as (typeof fs)["readdir"],
    });
  });
});
