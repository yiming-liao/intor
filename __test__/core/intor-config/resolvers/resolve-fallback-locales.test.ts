import { resolveFallbackLocales } from "../../../../src/intor/core/intor-config/resolvers/resolve-fallback-locales";
import { mockIntorLogger } from "../../../mock/mock-intor-logger";

describe("resolveFallbackLocales", () => {
  const { mockLogWarn, mockLogger } = mockIntorLogger();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const supportedLocales = ["en", "zh", "fr"] as const;

  it("should return empty object if fallbackLocales is undefined", () => {
    const result = resolveFallbackLocales({
      config: { defaultLocale: "en" },
      supportedLocales,
      logger: mockLogger,
    });

    expect(result).toEqual({});
    expect(mockLogger.child).toHaveBeenCalledWith({
      prefix: "resolveFallbackLocales",
    });
  });

  it("should filter valid fallback locales", () => {
    const result = resolveFallbackLocales({
      config: {
        defaultLocale: "en",
        fallbackLocales: {
          zh: ["en", "default"],
          fr: ["zh", "nonexistent"],
        },
      },
      supportedLocales,
      logger: mockLogger,
    });

    expect(result).toEqual({
      zh: ["en", "default"],
      fr: ["zh"],
    });

    expect(mockLogWarn).toHaveBeenCalledWith(
      'Invalid fallback locales for "fr": nonexistent',
    );
  });

  it("should handle fallback pointing to defaultLocale", () => {
    const result = resolveFallbackLocales({
      config: {
        defaultLocale: "en",
        fallbackLocales: {
          fr: ["en"],
        },
      },
      supportedLocales,
      logger: mockLogger,
    });

    expect(result).toEqual({
      fr: ["en"],
    });

    expect(mockLogWarn).not.toHaveBeenCalled();
  });

  it("should skip non-array fallback entries", () => {
    const result = resolveFallbackLocales({
      config: {
        defaultLocale: "en",
        fallbackLocales: {
          fr: "not-an-array" as unknown as string[],
        },
      },
      supportedLocales,
      logger: mockLogger,
    });

    expect(result).toEqual({});
    expect(mockLogWarn).not.toHaveBeenCalled();
  });

  it("should return empty object if fallbackLocales is not an object", () => {
    const result = resolveFallbackLocales({
      config: {
        defaultLocale: "en",
        fallbackLocales: null as unknown as Partial<Record<string, string[]>>,
      },
      supportedLocales,
      logger: mockLogger,
    });

    expect(result).toEqual({});
    expect(mockLogWarn).not.toHaveBeenCalled();
  });
});
