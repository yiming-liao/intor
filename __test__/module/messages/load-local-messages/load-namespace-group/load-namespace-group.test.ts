/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LimitFunction } from "p-limit";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadNamespaceGroup } from "@/modules/messages/load-local-messages/load-namespace-group";
import * as mergeModule from "@/modules/messages/load-local-messages/load-namespace-group/merge-namespace-messages";
import * as loggerModule from "@/shared/logger/get-logger";

describe("loadNamespaceGroup", () => {
  const messages: Record<string, any> = {};
  const limit = vi.fn(async (fn: () => any) =>
    fn(),
  ) as unknown as LimitFunction;

  const mockLogger = {
    trace: vi.fn(),
    child: vi.fn(() => mockLogger),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("skips when filePaths is empty", async () => {
    vi.spyOn(loggerModule, "getLogger").mockReturnValue(mockLogger as any);

    const namespaceGroupValue = { filePaths: [], isAtRoot: false };

    await loadNamespaceGroup({
      locale: "en-US",
      namespace: "testNs",
      messages,
      namespaceGroupValue,
      limit,
      logger: { id: "test" },
    });

    expect(mockLogger.trace).toHaveBeenCalledWith(
      `Skipped merging en-US/testNs because filePaths is empty`,
    );
  });

  it("merges root index.json into locale directly", async () => {
    vi.spyOn(loggerModule, "getLogger").mockReturnValue(mockLogger as any);
    vi.spyOn(mergeModule, "mergeNamespaceMessages").mockResolvedValue({
      base: { hello: "world" },
      sub: {},
    });

    const namespaceGroupValue = {
      filePaths: ["/fake/index.json"],
      isAtRoot: true,
    };

    await loadNamespaceGroup({
      locale: "en-US",
      namespace: "ignoredNs",
      messages,
      namespaceGroupValue,
      limit,
      logger: { id: "test" },
    });

    expect(messages["en-US"]).toEqual({ hello: "world" });
  });

  it("merges non-root namespace files correctly", async () => {
    vi.spyOn(loggerModule, "getLogger").mockReturnValue(mockLogger as any);
    vi.spyOn(mergeModule, "mergeNamespaceMessages").mockResolvedValue({
      base: { baseKey: "1" },
      sub: { subFile: { subKey: "2" } },
    });

    const namespaceGroupValue = {
      filePaths: ["/fake/file1.json", "/fake/file2.json"],
      isAtRoot: false,
    };

    await loadNamespaceGroup({
      locale: "en-US",
      namespace: "myNs",
      messages,
      namespaceGroupValue,
      limit,
      logger: { id: "test" },
    });

    expect(messages["en-US"]["myNs"]).toEqual({
      baseKey: "1",
      subFile: { subKey: "2" },
    });
    expect(mockLogger.trace).toHaveBeenCalledWith(
      `Merged en-US/myNs from 2 file(s)`,
      { namespace: "myNs" },
    );
  });
});
