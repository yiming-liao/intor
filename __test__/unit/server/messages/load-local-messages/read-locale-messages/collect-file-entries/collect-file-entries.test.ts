/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as loggerModule from "@/core/logger/get-logger";
import { collectFileEntries } from "@/server/messages/load-local-messages/read-locale-messages/collect-file-entries";

describe("collectFileEntries", () => {
  let mockReaddir: any;
  let mockLimit: any;
  let rootDir: string;
  let debugSpy: any;
  let traceSpy: any;

  beforeEach(() => {
    rootDir = "/mock/messages";
    mockReaddir = vi.fn();
    mockLimit = (fn: () => Promise<void>) => Promise.resolve(fn());
    debugSpy = vi.fn();
    traceSpy = vi.fn();
    vi.spyOn(loggerModule, "getLogger").mockReturnValue({
      child: () => ({
        debug: debugSpy,
        trace: traceSpy,
      }),
    } as any);
  });

  it("collects files recursively with correct FileEntry structure", async () => {
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
      exts: ["json"],
      loggerOptions: { id: "test" },
    });
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

  it("filters files by namespaces (but always allows index)", async () => {
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
      exts: ["json"],
      loggerOptions: { id: "test" },
    });
    expect(files.map((f) => f.namespace)).toEqual(["index", "auth"]);
  });

  it("includes custom extensions while always keeping json", async () => {
    mockReaddir
      .mockResolvedValueOnce([
        { name: "index.yaml", isDirectory: () => false },
        { name: "auth", isDirectory: () => true },
      ])
      .mockResolvedValueOnce([
        { name: "login.yaml", isDirectory: () => false },
        { name: "signup.json", isDirectory: () => false },
      ]);
    const files = await collectFileEntries({
      readdir: mockReaddir,
      limit: mockLimit,
      rootDir,
      exts: ["yaml"],
      loggerOptions: { id: "test" },
    });
    expect(files.map((f) => f.basename)).toEqual(["index", "login", "signup"]);
  });

  it("handles directory read errors gracefully", async () => {
    mockReaddir.mockRejectedValueOnce(new Error("permission denied"));
    const files = await collectFileEntries({
      readdir: mockReaddir,
      limit: mockLimit,
      rootDir,
      exts: ["json"],
      loggerOptions: { id: "test" },
    });
    expect(files).toEqual([]);
    expect(debugSpy).toHaveBeenCalled();
  });

  it("skips entries with empty namespace", async () => {
    mockReaddir.mockResolvedValueOnce([
      { name: ".json", isDirectory: () => false },
    ]);
    const files = await collectFileEntries({
      readdir: mockReaddir,
      limit: mockLimit,
      rootDir,
      namespaces: ["auth"],
      exts: ["json"],
      loggerOptions: { id: "test" },
    });
    expect(files).toEqual([]);
  });

  it("includes index namespace even if not listed", async () => {
    mockReaddir.mockResolvedValueOnce([
      { name: "index.json", isDirectory: () => false },
    ]);
    const files = await collectFileEntries({
      readdir: mockReaddir,
      limit: mockLimit,
      rootDir,
      namespaces: ["auth"],
      exts: ["json"],
      loggerOptions: { id: "test" },
    });
    expect(files.map((f) => f.namespace)).toEqual(["index"]);
  });

  it("includes only namespaces that are listed", async () => {
    mockReaddir.mockResolvedValueOnce([
      { name: "auth.json", isDirectory: () => false },
      { name: "payment.json", isDirectory: () => false },
    ]);
    const files = await collectFileEntries({
      readdir: mockReaddir,
      limit: mockLimit,
      rootDir,
      namespaces: ["auth"],
      exts: ["json"],
      loggerOptions: { id: "test" },
    });
    expect(files.map((f) => f.namespace)).toEqual(["auth"]);
  });
});
