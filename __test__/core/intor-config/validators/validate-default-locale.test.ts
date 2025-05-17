import type { IntorInitConfig } from "../../../../src/intor/core/intor-config/types/define-intor-config-types";
import { mockIntorLogger } from "../../../mock/mock-intor-logger";
import { validateDefaultLocale } from "../../../../src/intor/core/intor-config/validations/validate-default-locale";
import { IntorError } from "../../../../src/intor/core/intor-error";

describe("validateDefaultLocale", () => {
  const { mockLogError, mockLogger } = mockIntorLogger();

  const config = {
    id: "test-id",
    messages: {},
  } as IntorInitConfig;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if defaultLocale is undefined", () => {
    expect(() =>
      validateDefaultLocale({
        config: { ...config, defaultLocale: undefined as unknown as string },
        supportedLocales: ["en", "fr"],
        logger: mockLogger,
      }),
    ).toThrow(IntorError);

    expect(mockLogError).toHaveBeenCalledWith(
      "The defaultLocale is undefined.",
      { defaultLocale: undefined },
    );
  });

  it("should throw an error if defaultLocale is not included in supportedLocales", () => {
    const modifiedConfig = { ...config, defaultLocale: "de" };

    expect(() =>
      validateDefaultLocale({
        config: modifiedConfig,
        supportedLocales: ["en", "fr"],
        logger: mockLogger,
      }),
    ).toThrow(IntorError);

    expect(mockLogError).toHaveBeenCalledWith(
      "The defaultLocale is not included in the supportedLocales.",
      {
        defaultLocale: "de",
        supportedLocales: ["en", "fr"],
      },
    );
  });

  it("should return defaultLocale if it's included in supportedLocales", () => {
    const modifiedConfig = { ...config, defaultLocale: "en" };

    const result = validateDefaultLocale({
      config: modifiedConfig,
      supportedLocales: ["en", "fr"],
      logger: mockLogger,
    });

    expect(result).toBe("en");
    expect(mockLogError).not.toHaveBeenCalled();
  });

  it("should throw an error if defaultLocale is not included in supportedLocales when supportedLocales is undefined", () => {
    const modifiedConfig = { ...config, defaultLocale: "en" };

    expect(() =>
      validateDefaultLocale({
        config: modifiedConfig,
        supportedLocales: undefined,
        logger: mockLogger,
      }),
    ).toThrow(IntorError);

    expect(mockLogError).toHaveBeenCalledWith(
      "The defaultLocale is not included in the supportedLocales.",
      {
        defaultLocale: "en",
        supportedLocales: undefined,
      },
    );
  });
});
