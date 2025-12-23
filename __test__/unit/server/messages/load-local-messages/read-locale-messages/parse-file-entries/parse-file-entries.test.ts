/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FileEntry } from "@/server/messages/load-local-messages/read-locale-messages";
import type { Messages } from "@/server/messages/shared/types";
import type { LimitFunction } from "p-limit";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseFileEntries } from "@/server/messages/load-local-messages/read-locale-messages/parse-file-entries";
import * as readJsonModule from "@/server/messages/load-local-messages/read-locale-messages/parse-file-entries/utils/json-reader";
import * as nestModule from "@/server/messages/load-local-messages/read-locale-messages/parse-file-entries/utils/nest-object-from-path";
import * as validateModule from "@/server/messages/shared/utils/is-valid-messages";
import * as loggerModule from "@/server/shared/logger/get-logger";

describe("parseFileEntries", () => {
  const limit = ((fn: any) => fn()) as LimitFunction;
  const traceSpy = vi.fn();
  const errorSpy = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(loggerModule, "getLogger").mockReturnValue({
      core: { level: "trace" },
      child: () => ({ trace: traceSpy, error: errorSpy }),
    } as any);
  });

  it("should parse files using jsonReader and merge into namespaces correctly", async () => {
    vi.spyOn(readJsonModule, "jsonReader").mockImplementation(
      async (fp: string) => {
        if (fp.endsWith("auth/index.json")) return { c: "C" };
        if (fp.endsWith("auth/verify.json")) return { d: "D" };
        if (fp.endsWith("ui.json")) return { b: "B" };
        if (fp.endsWith("index.json")) return { a: "A" };
        return {} as Messages;
      },
    );
    const fileEntries: FileEntry[] = [
      {
        namespace: "index",
        fullPath: "/locale/en/index.json",
        relativePath: "index.json",
        segments: ["index"],
        basename: "index",
      },
      {
        namespace: "ui",
        fullPath: "/locale/en/ui.json",
        relativePath: "ui.json",
        segments: ["ui"],
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
      extraOptions: {},
    });
    expect(result).toEqual({
      a: "A",
      ui: { b: "B" },
      auth: {
        c: "C",
        verify: { d: "D" },
      },
    });
    expect(traceSpy).toHaveBeenCalledTimes(4);
  });

  it("should use custom reader when provided", async () => {
    const customReader = vi.fn(async () => ({ custom: { a: "a" } })) as any;
    vi.spyOn(nestModule, "nestObjectFromPath").mockReturnValue({
      wrapped: { a: "a" },
    });
    const result = await parseFileEntries({
      fileEntries: [
        {
          namespace: "index",
          fullPath: "/locale/en/index.yaml",
          relativePath: "index.yaml",
          segments: ["index"],
          basename: "index",
        },
      ],
      limit,
      extraOptions: { messagesReader: customReader },
    });
    expect(customReader).toHaveBeenCalled();
    expect(result).toEqual({ wrapped: { a: "a" } });
  });

  it("should log an error when a reader throws", async () => {
    vi.spyOn(readJsonModule, "jsonReader").mockRejectedValue(new Error("boom"));
    vi.spyOn(nestModule, "nestObjectFromPath").mockReturnValue({});
    await parseFileEntries({
      fileEntries: [
        {
          namespace: "index",
          fullPath: "/locale/en/index.json",
          relativePath: "index.json",
          segments: ["index"],
          basename: "index",
        },
      ],
      limit,
    });
    expect(errorSpy).toHaveBeenCalled();
  });

  it("should log an error and skip file when messages structure is invalid", async () => {
    vi.spyOn(readJsonModule, "jsonReader").mockResolvedValue({
      not: "valid",
    } as any);
    vi.spyOn(validateModule, "isValidMessages").mockReturnValue(false);
    await parseFileEntries({
      fileEntries: [
        {
          namespace: "index",
          fullPath: "/locale/en/index.json",
          relativePath: "index.json",
          segments: ["index"],
          basename: "index",
        },
      ],
      limit,
    });
    expect(errorSpy).toHaveBeenCalled();
    const [[message]] = errorSpy.mock.calls;
    expect(message).toBe("Failed to read or parse file.");
  });

  it("should not assign when deepMerge returns undefined", async () => {
    vi.spyOn(readJsonModule, "jsonReader").mockResolvedValue({});
    vi.spyOn(
      await import("@/server/messages/shared/utils/is-valid-messages"),
      "isValidMessages",
    ).mockReturnValue(true);

    vi.spyOn(await import("@/shared/utils"), "deepMerge").mockReturnValue(
      undefined,
    );
    const result = await parseFileEntries({
      fileEntries: [
        {
          namespace: "index",
          fullPath: "/locale/en/index.json",
          relativePath: "index.json",
          segments: ["index"],
          basename: "index",
        },
      ],
      limit,
    });
    expect(result).toEqual({});
  });
});
