import type { Namespace } from "../../../../../src/intor/types/message-structure-types";
import type pLimit from "p-limit";
import { mockIntorLogger } from "../../../../mock/mock-intor-logger";
import { loadLocaleWithFallback } from "../../../../../src/intor/core/intor-messages-loader/load-local-messages/load-locale-with-fallback";
import { loadSingleLocale } from "../../../../../src/intor/core/intor-messages-loader/load-local-messages/load-single-locale";

jest.mock(
  "../../../../../src/intor/core/intor-messages-loader/load-local-messages/load-single-locale",
);

const mockedLoadSingleLocale = loadSingleLocale as jest.Mock;

describe("loadLocaleWithFallback", () => {
  const basePath = "/locales";
  const messages = {};
  const fakeLimit = ((fn: () => Promise<void>) => fn()) as ReturnType<
    typeof pLimit
  >;
  const { mockLogger, mockLogWarn } = mockIntorLogger();

  const namespaces: Namespace[] = ["common"];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load the target locale successfully", async () => {
    mockedLoadSingleLocale.mockResolvedValueOnce(namespaces);

    const result = await loadLocaleWithFallback({
      basePath,
      locale: "en",
      fallbackLocales: ["zh"],
      namespaces: ["common"],
      messages,
      limit: fakeLimit,
      logger: mockLogger,
    });

    expect(result).toEqual(namespaces);
    expect(mockedLoadSingleLocale).toHaveBeenCalledTimes(1);
    expect(mockedLoadSingleLocale).toHaveBeenCalledWith(
      expect.objectContaining({ locale: "en" }),
    );
  });

  it("should load a fallback locale if the target fails", async () => {
    mockedLoadSingleLocale
      .mockRejectedValueOnce(new Error("Primary locale failed"))
      .mockResolvedValueOnce(namespaces); // Fallback success

    const result = await loadLocaleWithFallback({
      basePath,
      locale: "fr",
      fallbackLocales: ["zh"],
      namespaces: ["common"],
      messages,
      limit: fakeLimit,
      logger: mockLogger,
    });

    expect(result).toEqual(namespaces);
    expect(mockedLoadSingleLocale).toHaveBeenCalledTimes(2);
    expect(mockedLoadSingleLocale).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ locale: "fr" }),
    );
    expect(mockedLoadSingleLocale).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ locale: "zh" }),
    );
  });

  it("should return undefined if all locales fail", async () => {
    mockedLoadSingleLocale.mockRejectedValue(new Error("All failed"));

    const result = await loadLocaleWithFallback({
      basePath,
      locale: "de",
      fallbackLocales: ["zh", "ja"],
      namespaces: ["common"],
      messages,
      limit: fakeLimit,
      logger: mockLogger,
    });

    expect(result).toBeUndefined();
    expect(mockedLoadSingleLocale).toHaveBeenCalledTimes(3);
  });

  it("should call logger.warn on each failure and when all fail", async () => {
    mockedLoadSingleLocale.mockRejectedValue(new Error("Boom"));

    await loadLocaleWithFallback({
      basePath,
      locale: "ko",
      fallbackLocales: ["zh", "ja"],
      namespaces: ["common"],
      messages,
      limit: fakeLimit,
      logger: mockLogger,
    });

    // Each fail + final warn
    expect(mockLogWarn).toHaveBeenCalledTimes(4);
    expect(mockLogWarn).toHaveBeenNthCalledWith(
      1,
      "Error occurred while processing the locale.",
      expect.objectContaining({ locale: "ko" }),
    );
    expect(mockLogWarn).toHaveBeenNthCalledWith(
      4,
      "All fallback locales failed.",
      { attemptedLocales: ["ko", "zh", "ja"] },
    );
  });

  it("should not throw if logger is undefined", async () => {
    mockedLoadSingleLocale.mockRejectedValue(new Error("Oops"));

    const result = await loadLocaleWithFallback({
      basePath,
      locale: "en",
      fallbackLocales: ["fr"],
      namespaces: ["common"],
      messages,
      limit: fakeLimit,
      logger: undefined,
    });

    expect(result).toBeUndefined();
  });
});
