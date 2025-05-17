import type pLimit from "p-limit";
import path from "node:path";
import { mockIntorLogger } from "../../../mock/mock-intor-logger";
import { loadLocalMessages } from "../../../../src/intor/core/intor-messages-loader/load-local-messages/load-local-messages";
import { loadLocaleWithFallback } from "../../../../src/intor/core/intor-messages-loader/load-local-messages/load-locale-with-fallback";

jest.mock(
  "../../../../src/intor/core/intor-messages-loader/load-local-messages/load-locale-with-fallback",
);
const mockedLoadLocaleWithFallback = loadLocaleWithFallback as jest.Mock;
jest.mock("p-limit", () => {
  return () => ((fn: () => Promise<void>) => fn()) as ReturnType<typeof pLimit>;
});
const { mockLogDebug, mockLogInfo, mockLogWarn } = mockIntorLogger();
jest.mock("../../../../src/intor/core/intor-logger", () => {
  return {
    ...jest.requireActual("../../../../src/intor/core/intor-logger"),
    getOrCreateLogger: jest.fn(() => ({
      debug: mockLogDebug,
      info: mockLogInfo,
      warn: mockLogWarn,
    })),
  };
});

describe("loadLocalMessages", () => {
  const locale = "en";
  const fallbackLocales = ["zh"];
  const namespaces = ["common"];
  const cwd = process.cwd();
  const defaultResolvedPath = path.resolve(cwd, "messages");
  const customPath = "custom/messages";
  const customResolvedPath = path.resolve(cwd, "custom/messages");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load messages using default basePath and return messages", async () => {
    mockedLoadLocaleWithFallback.mockResolvedValue(["common"]);

    const result = await loadLocalMessages({
      locale,
      fallbackLocales,
      namespaces,
    });

    expect(mockedLoadLocaleWithFallback).toHaveBeenCalledWith(
      expect.objectContaining({
        basePath: defaultResolvedPath,
        locale,
        fallbackLocales,
        namespaces,
        messages: {},
        limit: expect.any(Function),
        logger: undefined,
      }),
    );

    expect(result).toEqual({});
  });

  it("should return empty object when locale is an empty string", async () => {
    const result = await loadLocalMessages({
      locale: "",
      fallbackLocales,
      namespaces,
    });

    expect(result).toEqual({});
  });

  it("should return empty object when locale is undefined", async () => {
    const result = await loadLocalMessages({
      locale: undefined as unknown as string,
      fallbackLocales,
      namespaces,
    });

    expect(result).toEqual({});
  });

  it("should load messages with custom basePath", async () => {
    mockedLoadLocaleWithFallback.mockResolvedValue(["common"]);

    await loadLocalMessages({
      basePath: customPath,
      locale,
      fallbackLocales,
      namespaces,
    });

    expect(mockedLoadLocaleWithFallback).toHaveBeenCalledWith(
      expect.objectContaining({
        basePath: customResolvedPath,
      }),
    );
  });

  it("should support concurrency config", async () => {
    mockedLoadLocaleWithFallback.mockResolvedValue(["common"]);

    const result = await loadLocalMessages({
      locale,
      concurrency: 5,
    });

    expect(mockedLoadLocaleWithFallback).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: expect.any(Function),
      }),
    );
    expect(result).toEqual({});
  });

  it("should use logger if loggerId is provided", async () => {
    const loggerId = "test-logger";

    mockedLoadLocaleWithFallback.mockResolvedValue(["common"]);

    await loadLocalMessages({
      locale: "en",
      loggerId,
    });

    // Verify that the debug and info methods were called
    expect(mockLogDebug).toHaveBeenCalledWith(
      "Starting to load local messages with configuration:",
      expect.objectContaining({
        locale: "en",
      }),
    );

    expect(mockLogInfo).toHaveBeenCalledWith(
      "Finished loading local messages.",
      expect.objectContaining({
        locale: "en",
        duration: expect.any(String),
      }),
    );
  });

  it("should not crash if loadLocaleWithFallback returns undefined", async () => {
    mockedLoadLocaleWithFallback.mockResolvedValue(undefined);

    const result = await loadLocalMessages({
      locale,
      fallbackLocales,
    });

    expect(result).toEqual({});
  });

  it("should include namespaces details in debug log if provided", async () => {
    const loggerId = "test-logger";

    mockedLoadLocaleWithFallback.mockResolvedValue(["common"]);

    const testNamespaces = ["common", "homepage"];

    await loadLocalMessages({
      locale: "en",
      loggerId,
      namespaces: testNamespaces,
    });

    expect(mockLogDebug).toHaveBeenCalledWith(
      "Starting to load local messages with configuration:",
      expect.objectContaining({
        namespaces: {
          count: testNamespaces.length,
          list: testNamespaces,
        },
      }),
    );
  });

  it("should log 'Finished loading local messages.' if valid namespaces are found", async () => {
    const loggerId = "test-logger";
    const validNamespaces = ["ui", "error", "api"];

    // 模擬返回有效的 namespaces
    mockedLoadLocaleWithFallback.mockResolvedValue(validNamespaces);

    await loadLocalMessages({
      locale: "en",
      loggerId,
      namespaces: validNamespaces,
    });

    expect(mockLogInfo).toHaveBeenCalledWith(
      "Finished loading local messages.",
      expect.objectContaining({
        locale: "en",
        namespaces: validNamespaces,
        duration: expect.any(String),
      }),
    );
  });

  it("should log 'No valid namespaces found for the locale.' if no valid namespaces are found", async () => {
    const loggerId = "test-logger";
    const invalidNamespaces: string[] = [];

    mockedLoadLocaleWithFallback.mockResolvedValue(invalidNamespaces);

    await loadLocalMessages({
      locale: "en",
      loggerId,
      namespaces: invalidNamespaces,
    });

    expect(mockLogWarn).toHaveBeenCalledWith(
      "No valid namespaces found for the locale.",
      expect.objectContaining({
        locale: "en",
        namespaces: invalidNamespaces,
        duration: expect.any(String),
      }),
    );
  });
});
