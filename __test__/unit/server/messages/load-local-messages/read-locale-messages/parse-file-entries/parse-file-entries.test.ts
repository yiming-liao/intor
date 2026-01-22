/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FileEntry } from "@/server/messages/load-local-messages/read-locale-messages";
import type { LimitFunction } from "p-limit";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as coreModule from "@/core";
import * as nestModule from "@/core/messages/utils/nest-object-from-path";
import { parseFileEntries } from "@/server/messages/load-local-messages/read-locale-messages/parse-file-entries";
import * as jsonReaderModule from "@/server/messages/load-local-messages/read-locale-messages/parse-file-entries/utils/json-reader";

describe("parseFileEntries", () => {
  const limit = ((fn: any) => Promise.resolve(fn())) as LimitFunction;
  const traceSpy = vi.fn();
  const warnSpy = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    traceSpy.mockReset();
    warnSpy.mockReset();
    vi.spyOn(coreModule, "getLogger").mockReturnValue({
      child: () => ({ trace: traceSpy, warn: warnSpy }),
    } as any);
    vi.spyOn(coreModule, "isValidMessages").mockReturnValue(true);
    vi.spyOn(coreModule, "deepMerge").mockImplementation(
      (a: any = {}, b: any = {}) => ({ ...a, ...b }),
    );
    vi.spyOn(nestModule, "nestObjectFromPath").mockImplementation(
      (_path, messages) => messages as any,
    );
  });

  it("parses JSON files and merges namespaces correctly", async () => {
    vi.spyOn(jsonReaderModule, "jsonReader").mockImplementation(
      async (fp: string): Promise<any> => {
        if (fp.endsWith("/auth/index.json")) return { c: "C" };
        if (fp.endsWith("/auth/verify.json")) return { d: "D" };
        if (fp.endsWith("/ui.json")) return { b: "B" };
        if (fp.endsWith("/index.json")) return { a: "A" };
        return {};
      },
    );
    const fileEntries: FileEntry[] = [
      {
        namespace: "index",
        fullPath: "/locale/en/index.json",
        relativePath: "index.json",
        segments: ["index", "index"],
        basename: "index",
      },
      {
        namespace: "ui",
        fullPath: "/locale/en/ui.json",
        relativePath: "ui.json",
        segments: ["ui", "ui"],
        basename: "ui",
      },
      {
        namespace: "auth",
        fullPath: "/locale/en/auth/index.json",
        relativePath: "auth/index.json",
        segments: ["auth", "index"],
        basename: "index",
      },
      {
        namespace: "auth",
        fullPath: "/locale/en/auth/verify.json",
        relativePath: "auth/verify.json",
        segments: ["auth", "verify"],
        basename: "verify",
      },
    ];
    const result = await parseFileEntries({
      fileEntries,
      limit,
      loggerOptions: { id: "test" },
    });
    expect(result).toEqual({
      a: "A",
      ui: { b: "B" },
      auth: {
        c: "C",
        d: "D",
      },
    });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("uses custom reader for non-json extensions", async () => {
    const yamlReader = vi.fn(async () => ({ hello: "world" }));
    const result = await parseFileEntries({
      fileEntries: [
        {
          namespace: "index",
          fullPath: "/locale/en/index.yaml",
          relativePath: "index.yaml",
          segments: ["index", "index"],
          basename: "index",
        },
      ],
      limit,
      readers: { yaml: yamlReader },
      loggerOptions: { id: "test" },
    });
    expect(yamlReader).toHaveBeenCalledWith("/locale/en/index.yaml");
    expect(result).toEqual({ hello: "world" });
  });

  it("logs error when reader throws", async () => {
    const badReader = vi.fn(async () => {
      throw new Error("boom");
    });
    await parseFileEntries({
      fileEntries: [
        {
          namespace: "index",
          fullPath: "/locale/en/index.yaml",
          relativePath: "index.yaml",
          segments: ["index", "index"],
          basename: "index",
        },
      ],
      limit,
      readers: {
        ".yaml": badReader,
      },
      loggerOptions: { id: "test" },
    });
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it("skips file when messages structure is invalid", async () => {
    vi.spyOn(coreModule, "isValidMessages").mockReturnValue(false);
    vi.spyOn(jsonReaderModule, "jsonReader").mockResolvedValue({
      nope: "true",
    });
    const result = await parseFileEntries({
      fileEntries: [
        {
          namespace: "index",
          fullPath: "/locale/en/index.json",
          relativePath: "index.json",
          segments: ["index", "index"],
          basename: "index",
        },
      ],
      limit,
      loggerOptions: { id: "test" },
    });
    expect(result).toEqual({});
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });
});
