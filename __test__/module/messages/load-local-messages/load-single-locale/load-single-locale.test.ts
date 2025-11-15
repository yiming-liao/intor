/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LimitFunction } from "p-limit";
import fs from "node:fs/promises";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as namespaceModule from "@/modules/messages/load-local-messages/load-namespace-group";
import { loadSingleLocale } from "@/modules/messages/load-local-messages/load-single-locale";
import * as prepareModule from "@/modules/messages/load-local-messages/prepare-namespace-groups";
import * as loggerModule from "@/shared/logger/get-logger";

describe("loadSingleLocale", () => {
  const mockLogger = {
    warn: vi.fn(),
    trace: vi.fn(),
    child: vi.fn(() => mockLogger),
  };
  const limit = vi.fn(async (fn: () => any) =>
    fn(),
  ) as unknown as LimitFunction;
  const messages: Record<string, any> = {};

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns undefined and logs when path does not exist", async () => {
    vi.spyOn(loggerModule, "getLogger").mockReturnValue(mockLogger as any);
    vi.spyOn(fs, "stat").mockRejectedValue(new Error("not found"));

    const result = await loadSingleLocale({
      basePath: "/fake/path",
      locale: "en-US",
      namespaces: ["ns1"],
      messages,
      limit,
      logger: { id: "test" },
    });

    expect(result).toBeUndefined();
    expect(mockLogger.warn).toHaveBeenCalledWith(
      "Error checking locale path.",
      expect.objectContaining({ locale: "en-US" }),
    );
  });

  it("returns undefined and logs when namespaceGroups is empty", async () => {
    vi.spyOn(loggerModule, "getLogger").mockReturnValue(mockLogger as any);
    vi.spyOn(fs, "stat").mockResolvedValue({ isDirectory: () => true } as any);
    vi.spyOn(prepareModule, "prepareNamespaceGroups").mockResolvedValue(
      new Map(),
    );

    const result = await loadSingleLocale({
      basePath: "/fake/path",
      locale: "en-US",
      namespaces: ["ns1"],
      messages,
      limit,
      logger: { id: "test" },
    });

    expect(result).toBeUndefined();
    expect(mockLogger.warn).toHaveBeenCalledWith(
      "No namespace groups found.",
      expect.objectContaining({ locale: "en-US" }),
    );
  });

  it("loads namespace groups successfully", async () => {
    vi.spyOn(loggerModule, "getLogger").mockReturnValue(mockLogger as any);
    vi.spyOn(fs, "stat").mockResolvedValue({ isDirectory: () => true } as any);
    vi.spyOn(prepareModule, "prepareNamespaceGroups").mockResolvedValue(
      new Map([["ns1", { isAtRoot: true, filePaths: ["/fake/index.json"] }]]),
    );
    const loadNamespaceSpy = vi
      .spyOn(namespaceModule, "loadNamespaceGroup")
      .mockImplementation(async () => {});

    const result = await loadSingleLocale({
      basePath: "/fake/path",
      locale: "en-US",
      namespaces: ["ns1"],
      messages,
      limit,
      logger: { id: "test" },
    });

    expect(result).toEqual(["ns1"]);
    expect(loadNamespaceSpy).toHaveBeenCalledTimes(1);
    expect(mockLogger.trace).toHaveBeenCalledWith(
      "Prepared namespace groups from scanning local files.",
      expect.objectContaining({
        namespaceGroups: expect.any(Array),
      }),
    );
  });
});
