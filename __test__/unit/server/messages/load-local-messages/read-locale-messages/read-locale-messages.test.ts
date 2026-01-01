/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LocaleMessages } from "intor-translator";
import path from "node:path";
import { describe, it, expect, vi } from "vitest";
import { readLocaleMessages } from "@/server/messages/load-local-messages/read-locale-messages";
import * as collectModule from "@/server/messages/load-local-messages/read-locale-messages/collect-file-entries";
import * as parseModule from "@/server/messages/load-local-messages/read-locale-messages/parse-file-entries";

describe("readLocaleMessages", () => {
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
    common: { hello: "Hello", world: "World" },
  };

  it("returns locale wrapped NamespaceMessages correctly", async () => {
    // Mock collectFileEntries
    vi.spyOn(collectModule, "collectFileEntries").mockResolvedValue(
      mockFileEntries,
    );

    // Mock parseFileEntries
    vi.spyOn(parseModule, "parseFileEntries").mockResolvedValue(
      mockNamespaceMessages,
    );

    const options = {
      limit: vi.fn() as any,
      rootDir: "messages",
      locale: "en",
      loggerOptions: { id: "test" },
    };

    const result: LocaleMessages = await readLocaleMessages(options);

    expect(result).toEqual({
      en: mockNamespaceMessages,
    });
  });

  it("passes custom messagesReader and exts to underlying functions", async () => {
    const mockReader = vi.fn().mockResolvedValue(mockNamespaceMessages);
    const mockLimit = vi.fn((fn) => fn());

    vi.spyOn(collectModule, "collectFileEntries").mockResolvedValue(
      mockFileEntries,
    );
    vi.spyOn(parseModule, "parseFileEntries").mockResolvedValue(
      mockNamespaceMessages,
    );

    const options = {
      limit: mockLimit as any,
      rootDir: "messages",
      locale: "en",
      readOptions: {
        exts: [".json", ".yaml"],
        messagesReader: mockReader,
      },
      loggerOptions: { id: "test" },
    };

    const result = await readLocaleMessages(options);

    expect(mockReader).not.toHaveBeenCalled(); // parseFileEntries 處理了 reader
    expect(result).toEqual({ en: mockNamespaceMessages });
  });

  it("resolves correct paths based on rootDir and locale", async () => {
    const spyCollect = vi
      .spyOn(collectModule, "collectFileEntries")
      .mockResolvedValue(mockFileEntries);
    vi.spyOn(parseModule, "parseFileEntries").mockResolvedValue(
      mockNamespaceMessages,
    );

    await readLocaleMessages({
      limit: vi.fn() as any,
      rootDir: "messages",
      locale: "fr",
      loggerOptions: { id: "test" },
    });

    expect(spyCollect).toHaveBeenCalledWith(
      expect.objectContaining({
        rootDir: path.resolve(process.cwd(), "messages", "fr"),
      }),
    );
  });
});
