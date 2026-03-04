/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LocaleMessages } from "intor-translator";
import path from "node:path";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { readLocaleMessages } from "../../../../../../src/server/messages/load-local-messages/read-locale-messages";
import * as collectModule from "../../../../../../src/server/messages/load-local-messages/read-locale-messages/collect-file-entries";
import * as parseModule from "../../../../../../src/server/messages/load-local-messages/read-locale-messages/parse-file-entries";

describe("readLocaleMessages()", () => {
  const mockFileEntries = [
    {
      namespace: "common",
      segments: ["common"],
      basename: "common.json",
      relativePath: "",
      fullPath: "/mock/path/common.json",
    },
  ];
  const mockNamespaceMessages = {
    common: { hello: "Hello" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(collectModule, "collectFileEntries").mockResolvedValue(
      mockFileEntries,
    );
    vi.spyOn(parseModule, "parseFileEntries").mockResolvedValue(
      mockNamespaceMessages,
    );
  });

  it("wraps parsed messages under locale key", async () => {
    const result: LocaleMessages = await readLocaleMessages({
      locale: "en",
      rootDir: "messages",
      limit: vi.fn() as any,
      readers: {},
      loggerOptions: { id: "TEST_ID" },
    });
    expect(result).toEqual({
      en: mockNamespaceMessages,
    });
  });

  it("forwards namespaces when defined", async () => {
    await readLocaleMessages({
      locale: "en",
      namespaces: ["common"],
      rootDir: "messages",
      limit: vi.fn() as any,
      readers: {},
      loggerOptions: { id: "TEST_ID" },
    });
    expect(collectModule.collectFileEntries).toHaveBeenCalledWith(
      expect.objectContaining({
        namespaces: ["common"],
      }),
    );
  });

  it("does not forward namespaces when undefined", async () => {
    await readLocaleMessages({
      locale: "en",
      rootDir: "messages",
      limit: vi.fn() as any,
      readers: {},
      loggerOptions: { id: "TEST_ID" },
    });
    const call = vi.mocked(collectModule.collectFileEntries).mock.calls[0]![0];
    expect("namespaces" in call).toBe(false);
  });

  it("derives exts from readers keys", async () => {
    const readers = {
      json: vi.fn(),
      yaml: vi.fn(),
    };
    await readLocaleMessages({
      locale: "en",
      rootDir: "messages",
      limit: vi.fn() as any,
      readers,
      loggerOptions: { id: "TEST_ID" },
    });
    expect(collectModule.collectFileEntries).toHaveBeenCalledWith(
      expect.objectContaining({
        exts: ["json", "yaml"],
      }),
    );
  });

  it("uses empty exts and empty readers when undefined", async () => {
    await readLocaleMessages({
      locale: "en",
      rootDir: "messages",
      limit: vi.fn() as any,
      loggerOptions: { id: "TEST_ID" },
    } as any);
    const collectCall = vi.mocked(collectModule.collectFileEntries).mock
      .calls[0]![0];
    const parseCall = vi.mocked(parseModule.parseFileEntries).mock.calls[0]![0];
    expect(collectCall.exts).toEqual([]);
    expect(parseCall.readers).toEqual({});
  });

  it("resolves correct rootDir path", async () => {
    await readLocaleMessages({
      locale: "fr",
      rootDir: "messages",
      limit: vi.fn() as any,
      readers: {},
      loggerOptions: { id: "TEST_ID" },
    });
    expect(collectModule.collectFileEntries).toHaveBeenCalledWith(
      expect.objectContaining({
        rootDir: path.resolve("messages", "fr"),
      }),
    );
  });
});
