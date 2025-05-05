import type { IntorInitConfig } from "@/intor/core/intor-config/types/define-intor-config.types";
import type { IntorLogger } from "@/intor/core/intor-logger/intor-logger";
import { validateDefaultLocale } from "@/intor/core/intor-config/validations/validate-default-locale";
import { IntorError } from "@/intor/core/intor-error";

describe("validateDefaultLocale", () => {
  const loggerMock = {
    error: jest.fn(),
  } as unknown as IntorLogger;

  const config = {
    id: "test-id",
    defaultLocale: "en",
    messages: {},
  } as unknown as IntorInitConfig;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if defaultLocale is undefined", () => {
    const modifiedConfig = {
      ...config,
      defaultLocale: undefined,
    } as unknown as IntorInitConfig;

    expect(() =>
      validateDefaultLocale({
        config: modifiedConfig,
        supportedLocales: ["en", "fr"],
        logger: loggerMock,
      }),
    ).toThrow(IntorError);

    expect(loggerMock.error).toHaveBeenCalledWith(
      "The defaultLocale is undefined:",
      { defaultLocale: undefined },
    );
  });

  it("should throw an error if defaultLocale is not included in supportedLocales", () => {
    const modifiedConfig = { ...config, defaultLocale: "de" };

    expect(() =>
      validateDefaultLocale({
        config: modifiedConfig,
        supportedLocales: ["en", "fr"],
        logger: loggerMock,
      }),
    ).toThrow(IntorError);

    expect(loggerMock.error).toHaveBeenCalledWith(
      "The defaultLocale is not included in the supportedLocales:",
      {
        defaultLocale: "de",
        supportedLocales: ["en", "fr"],
      },
    );
  });

  it("should return defaultLocale if it's included in supportedLocales", () => {
    const result = validateDefaultLocale({
      config,
      supportedLocales: ["en", "fr"],
      logger: loggerMock,
    });

    expect(result).toBe("en");
    expect(loggerMock.error).not.toHaveBeenCalled();
  });

  it("should throw an error if defaultLocale is not included in supportedLocales when supportedLocales is undefined", () => {
    const modifiedConfig = { ...config, defaultLocale: "en" };

    expect(() =>
      validateDefaultLocale({
        config: modifiedConfig,
        supportedLocales: undefined,
        logger: loggerMock,
      }),
    ).toThrow(IntorError);

    expect(loggerMock.error).toHaveBeenCalledWith(
      "The defaultLocale is not included in the supportedLocales:",
      {
        defaultLocale: "en",
        supportedLocales: undefined,
      },
    );
  });
});
