/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { prepareNamespaceGroups } from "@/modules/messages/load-local-messages/prepare-namespace-groups/prepare-namespace-groups";
import * as traverseModule from "@/modules/messages/load-local-messages/prepare-namespace-groups/traverse-directory";

describe("prepareNamespaceGroups", () => {
  let traverseSpy: any;

  beforeEach(() => {
    traverseSpy = vi
      .spyOn(traverseModule, "traverseDirectory")
      .mockImplementation(async ({ namespaceGroups }: any) => {
        const ns = "testNs";
        const files = ["file1.json", "file2.json"];
        namespaceGroups.set(ns, { files });
        return namespaceGroups;
      });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call traverseDirectory and return correct namespaceGroups", async () => {
    const result = await prepareNamespaceGroups({
      basePath: "/fake-path",
    } as any);

    expect(traverseSpy).toHaveBeenCalledTimes(1);
    expect(result.has("testNs")).toBe(true);
    expect(result.get("testNs")).toEqual({
      files: ["file1.json", "file2.json"],
    });
  });

  it("should handle traverseDirectory throwing error", async () => {
    traverseSpy.mockImplementationOnce(() => {
      throw new Error("fake error");
    });

    await expect(
      prepareNamespaceGroups({ basePath: "/fake-path" } as any),
    ).rejects.toThrow("fake error");
  });
});
