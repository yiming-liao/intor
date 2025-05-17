import type { IntorLogger } from "../../../../../src/intor/core/intor-logger/intor-logger";
import type { LocaleNamespaceMessages } from "../../../../../src/intor/types/message-structure-types";
import type pLimit from "p-limit";
import { loadNamespaceGroup } from "../../../../../src/intor/core/intor-messages-loader/load-local-messages/load-namespace-group";
import { mergeNamespaceMessages } from "../../../../../src/intor/core/intor-messages-loader/load-local-messages/load-namespace-group/merge-namespace-messages";

jest.mock(
  "../../../../../src/intor/core/intor-messages-loader/load-local-messages/load-namespace-group/merge-namespace-messages",
  () => ({ mergeNamespaceMessages: jest.fn() }),
);

describe("loadNamespaceGroup", () => {
  const mockLogDebug = jest.fn();
  const mockLogger = {
    child: jest.fn().mockReturnValue({
      debug: mockLogDebug,
    }),
  } as unknown as IntorLogger;

  const createLimit = () => {
    return (fn: () => Promise<void>) => fn();
  };

  const baseMessage = { hello: "world" };
  const subMessage = { sub: "message" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should merge root-level messages and assign to the correct locale/namespace", async () => {
    (mergeNamespaceMessages as jest.Mock).mockResolvedValue({
      base: baseMessage,
      sub: {},
    });

    const messages: LocaleNamespaceMessages = {};

    await loadNamespaceGroup({
      locale: "en",
      namespace: "common",
      messages,
      namespaceGroupValue: {
        isAtRoot: true,
        filePaths: ["./mock.json"],
      },
      limit: createLimit() as ReturnType<typeof pLimit>,
      logger: mockLogger,
    });

    expect(messages.en?.common).toEqual(baseMessage);
    expect(mockLogDebug).not.toHaveBeenCalled();
  });

  it("should merge non-root messages and log debug info", async () => {
    (mergeNamespaceMessages as jest.Mock).mockResolvedValue({
      base: baseMessage,
      sub: subMessage,
    });

    const messages: LocaleNamespaceMessages = {};

    await loadNamespaceGroup({
      locale: "en",
      namespace: "auth",
      messages,
      namespaceGroupValue: {
        isAtRoot: false,
        filePaths: ["file1.json", "file2.json"],
      },
      limit: createLimit() as ReturnType<typeof pLimit>,
      logger: mockLogger,
    });

    expect(messages.en?.auth).toEqual({ ...baseMessage, ...subMessage });
    expect(mockLogDebug).toHaveBeenCalledWith("Merged en/auth from 2 file(s)", {
      namespace: "auth",
    });
  });

  it("should work correctly without a logger", async () => {
    (mergeNamespaceMessages as jest.Mock).mockResolvedValue({
      base: baseMessage,
      sub: {},
    });

    const messages: LocaleNamespaceMessages = {};

    await loadNamespaceGroup({
      locale: "zh",
      namespace: "site",
      messages,
      namespaceGroupValue: {
        isAtRoot: true,
        filePaths: ["a.json"],
      },
      limit: createLimit() as ReturnType<typeof pLimit>,
    });

    expect(messages.zh?.site).toEqual(baseMessage);
  });

  it("should skip if filePaths is empty", async () => {
    const messages: LocaleNamespaceMessages = {};

    await loadNamespaceGroup({
      locale: "en",
      namespace: "empty",
      messages,
      namespaceGroupValue: {
        isAtRoot: false,
        filePaths: [],
      },
      limit: createLimit() as ReturnType<typeof pLimit>,
      logger: mockLogger,
    });

    expect(mergeNamespaceMessages).not.toHaveBeenCalled();
    expect(messages.en?.empty).toBeUndefined();
  });

  it("should skip if filePaths is empty", async () => {
    const messages: LocaleNamespaceMessages = {};

    await loadNamespaceGroup({
      locale: "en",
      namespace: "empty",
      messages,
      namespaceGroupValue: {
        isAtRoot: false,
        filePaths: [],
      },
      limit: createLimit() as ReturnType<typeof pLimit>,
      logger: mockLogger,
    });

    expect(mergeNamespaceMessages).not.toHaveBeenCalled();
    expect(messages.en?.empty).toBeUndefined();
  });
});
