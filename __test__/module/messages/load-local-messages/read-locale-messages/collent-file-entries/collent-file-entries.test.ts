/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { collectFileEntries } from "@/modules/messages/load-local-messages/read-locale-messages/collect-file-entries";
import * as loggerModule from "@/shared/logger/get-logger";

describe("collectFileEntries", () => {
  let mockReaddir: any;
  let mockLimit: any;
  let rootDir: string;
  let debugSpy: any;

  beforeEach(() => {
    rootDir = "/mock/messages";
    mockLimit = (fn: () => Promise<void>) => fn();
    mockReaddir = vi.fn();

    debugSpy = vi.fn();

    vi.spyOn(loggerModule, "getLogger").mockReturnValue({
      child: () => ({
        core: { level: "debug" },
        debug: debugSpy,
        trace: vi.fn(),
        error: vi.fn(),
      }),
    } as any);
  });

  it("should collect files recursively with correct FileEntry structure", async () => {
    mockReaddir
      .mockResolvedValueOnce([
        { name: "index.json", isDirectory: () => false },
        { name: "auth", isDirectory: () => true },
      ])
      .mockResolvedValueOnce([
        { name: "login.json", isDirectory: () => false },
        { name: "signup.txt", isDirectory: () => false },
      ]);

    const files = await collectFileEntries({
      readdir: mockReaddir,
      limit: mockLimit,
      rootDir,
      extraOptions: { exts: [".json"], loggerOptions: { level: "silent" } },
    });

    expect(files).toHaveLength(2);
    expect(files).toEqual([
      {
        namespace: "index",
        fullPath: "/mock/messages/index.json",
        relativePath: "index.json",
        segments: ["index"],
        basename: "index",
      },
      {
        namespace: "auth",
        fullPath: "/mock/messages/auth/login.json",
        relativePath: "auth/login.json",
        segments: ["auth", "login"],
        basename: "login",
      },
    ]);
  });

  it("should filter files by namespaces", async () => {
    mockReaddir
      .mockResolvedValueOnce([
        { name: "index.json", isDirectory: () => false },
        { name: "auth", isDirectory: () => true },
      ])
      .mockResolvedValueOnce([
        { name: "login.json", isDirectory: () => false },
      ]);

    const files = await collectFileEntries({
      readdir: mockReaddir,
      limit: mockLimit,
      rootDir,
      namespaces: ["auth"],
      extraOptions: { exts: [".json"], loggerOptions: { level: "silent" } },
    });

    expect(files).toHaveLength(2);
    expect(files.some((f) => f.namespace === "auth")).toBe(true);
  });

  it("should respect custom extensions", async () => {
    mockReaddir.mockResolvedValueOnce([
      { name: "index.yaml", isDirectory: () => false },
      { name: "auth", isDirectory: () => true },
    ]);
    mockReaddir.mockResolvedValueOnce([
      { name: "login.yaml", isDirectory: () => false },
      { name: "signup.json", isDirectory: () => false },
    ]);

    const files = await collectFileEntries({
      readdir: mockReaddir,
      limit: mockLimit,
      rootDir,
      extraOptions: { exts: [".yaml"], loggerOptions: { level: "silent" } },
    });

    expect(files).toHaveLength(2);
    expect(files.map((f) => f.basename)).toEqual(["index", "login"]);
  });

  it("should handle directory read errors gracefully", async () => {
    const error = new Error("permission denied");
    mockReaddir.mockRejectedValueOnce(error);

    const files = await collectFileEntries({
      readdir: mockReaddir,
      limit: mockLimit,
      rootDir,
      extraOptions: { exts: [".json"], loggerOptions: { level: "silent" } },
    });

    expect(files).toEqual([]);
  });

  it("should skip entries with empty namespace", async () => {
    mockReaddir.mockResolvedValue([
      { name: ".json", isDirectory: () => false },
    ]);

    const files = await collectFileEntries({
      readdir: mockReaddir,
      limit: mockLimit,
      rootDir,
      namespaces: ["auth"],
      extraOptions: { exts: [".json"], loggerOptions: { level: "silent" } },
    });

    expect(files).toEqual([]);
  });

  it("should always include the 'index' namespace even if filtered out", async () => {
    mockReaddir.mockResolvedValue([
      { name: "index.json", isDirectory: () => false },
    ]);

    const files = await collectFileEntries({
      readdir: mockReaddir,
      limit: mockLimit,
      rootDir,
      namespaces: ["auth"],
      extraOptions: { exts: [".json"], loggerOptions: { level: "silent" } },
    });

    expect(files.map((f) => f.namespace)).toEqual(["index"]);
  });

  it("should include a namespace that is listed", async () => {
    mockReaddir.mockResolvedValue([
      { name: "auth.json", isDirectory: () => false },
    ]);

    const files = await collectFileEntries({
      readdir: mockReaddir,
      limit: mockLimit,
      rootDir,
      namespaces: ["auth"],
      extraOptions: { exts: [".json"], loggerOptions: { level: "silent" } },
    });

    expect(files.map((f) => f.namespace)).toEqual(["auth"]);
  });

  it("should exclude namespaces that are not listed", async () => {
    mockReaddir.mockResolvedValue([
      { name: "payment.json", isDirectory: () => false },
    ]);

    const files = await collectFileEntries({
      readdir: mockReaddir,
      limit: mockLimit,
      rootDir,
      namespaces: ["auth"],
      extraOptions: { exts: [".json"], loggerOptions: { level: "silent" } },
    });

    expect(files).toEqual([]);
  });
});
