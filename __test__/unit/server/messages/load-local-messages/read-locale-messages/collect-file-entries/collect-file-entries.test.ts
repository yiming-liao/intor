/* eslint-disable unicorn/no-array-sort */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as loggerModule from "@/core/logger/get-logger";
import { collectFileEntries } from "@/server/messages/load-local-messages/read-locale-messages/collect-file-entries";

function isFile(name: string) {
  return {
    name,
    isFile: () => true,
    isDirectory: () => false,
  };
}

function isDir(name: string) {
  return {
    name,
    isFile: () => false,
    isDirectory: () => true,
  };
}

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
    mockReaddir.mockImplementation((dir: string) => {
      if (dir === rootDir) {
        return Promise.resolve([isFile("index.json"), isDir("auth")]);
      }
      if (dir === `${rootDir}/auth`) {
        return Promise.resolve([isFile("login.json"), isFile("signup.txt")]);
      }
      return Promise.resolve([]);
    });
    const files = await collectFileEntries({
      readdir: mockReaddir,
      limit: mockLimit,
      rootDir,
      exts: ["json"],
      loggerOptions: { id: "test" },
    });
    expect(files).toEqual(
      expect.arrayContaining([
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
      ]),
    );
  });

  it("filters files by namespaces (but always allows index)", async () => {
    mockReaddir.mockImplementation((dir: string) => {
      if (dir === rootDir) {
        return Promise.resolve([isFile("index.json"), isDir("auth")]);
      }
      if (dir === `${rootDir}/auth`) {
        return Promise.resolve([isFile("login.json")]);
      }
      return Promise.resolve([]);
    });
    const files = await collectFileEntries({
      readdir: mockReaddir,
      limit: mockLimit,
      rootDir,
      namespaces: ["auth"],
      exts: ["json"],
      loggerOptions: { id: "test" },
    });
    expect(files.map((f) => f.namespace).sort()).toEqual(["auth", "index"]);
  });

  it("includes custom extensions while always keeping json", async () => {
    mockReaddir.mockImplementation((dir: string) => {
      if (dir === rootDir) {
        return Promise.resolve([isFile("index.yaml"), isDir("auth")]);
      }
      if (dir === `${rootDir}/auth`) {
        return Promise.resolve([isFile("login.yaml"), isFile("signup.json")]);
      }
      return Promise.resolve([]);
    });
    const files = await collectFileEntries({
      readdir: mockReaddir,
      limit: mockLimit,
      rootDir,
      exts: ["yaml"],
      loggerOptions: { id: "test" },
    });
    expect(files.map((f) => f.basename).sort()).toEqual([
      "index",
      "login",
      "signup",
    ]);
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
    mockReaddir.mockImplementation(() => Promise.resolve([isFile(".json")]));
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
    mockReaddir.mockImplementation(() =>
      Promise.resolve([isFile("index.json")]),
    );
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
    mockReaddir.mockImplementation(() =>
      Promise.resolve([isFile("auth.json"), isFile("payment.json")]),
    );
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
