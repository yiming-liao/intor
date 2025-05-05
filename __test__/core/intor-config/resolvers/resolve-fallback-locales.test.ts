import type { IntorLogger } from "@/intor/core/intor-logger/intor-logger";
import { resolveFallbackLocales } from "@/intor/core/intor-config/resolvers/resolve-fallback-locales";

const mockLogger = () => {
  return {
    warn: jest.fn(),
  } as unknown as IntorLogger;
};

describe("resolveFallbackLocales", () => {
  const supportedLocales = ["en", "zh", "fr"] as const;

  it("should return empty object if fallbackLocales is undefined", () => {
    const logger = mockLogger();
    const result = resolveFallbackLocales({
      config: { defaultLocale: "en" },
      supportedLocales,
      logger,
    });

    expect(result).toEqual({});
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it("should filter valid fallback locales", () => {
    const logger = mockLogger();
    const result = resolveFallbackLocales({
      config: {
        defaultLocale: "en",
        fallbackLocales: {
          zh: ["en", "default"],
          fr: ["zh", "nonexistent"],
        },
      },
      supportedLocales,
      logger,
    });

    expect(result).toEqual({
      zh: ["en", "default"],
      fr: ["zh"],
    });

    expect(logger.warn).toHaveBeenCalledWith(
      'Invalid fallback locales for "fr": nonexistent',
    );
  });

  it("should handle fallback pointing to defaultLocale", () => {
    const logger = mockLogger();
    const result = resolveFallbackLocales({
      config: {
        defaultLocale: "en",
        fallbackLocales: {
          fr: ["en"],
        },
      },
      supportedLocales,
      logger,
    });

    expect(result).toEqual({
      fr: ["en"],
    });

    expect(logger.warn).not.toHaveBeenCalled();
  });

  it("should skip non-array fallback entries", () => {
    const logger = mockLogger();
    const result = resolveFallbackLocales({
      config: {
        defaultLocale: "en",
        fallbackLocales: {
          fr: "not-an-array" as unknown as string[],
        },
      },
      supportedLocales,
      logger,
    });

    expect(result).toEqual({});
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it("should return empty object if fallbackLocales is not an object", () => {
    const logger = mockLogger();
    const result = resolveFallbackLocales({
      config: {
        defaultLocale: "en",
        fallbackLocales: null as unknown as Partial<Record<string, string[]>>,
      },
      supportedLocales,
      logger,
    });

    expect(result).toEqual({});
    expect(logger.warn).not.toHaveBeenCalled();
  });
});
