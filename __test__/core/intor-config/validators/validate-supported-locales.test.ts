import type { IntorInitConfig } from "@/intor/core/intor-config/types/define-intor-config.types";
import type { IntorLogger } from "@/intor/core/intor-logger/intor-logger";
import { validateSupportedLocales } from "@/intor/core/intor-config/validations/validate-supported-locales";
import { IntorError } from "@/intor/core/intor-error";

describe("validateSupportedLocales", () => {
  const mockLogger = {
    error: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns supportedLocales when provided", () => {
    const config = {
      id: "test",
      supportedLocales: ["en", "fr"],
    } as unknown as IntorInitConfig;
    const result = validateSupportedLocales({
      config,
      logger: mockLogger as unknown as IntorLogger,
    });
    expect(result).toEqual(["en", "fr"]);
  });

  it("infers supportedLocales from message keys when supportedLocales is undefined", () => {
    const config = {
      id: "test",
      messages: {
        en: {},
        fr: {},
      },
    } as unknown as IntorInitConfig;
    const result = validateSupportedLocales({
      config,
      logger: mockLogger as unknown as IntorLogger,
    });
    expect(result).toEqual(["en", "fr"]);
  });

  it("throws error if loaderOptions is provided but supportedLocales is missing", () => {
    const config = {
      id: "test",
      loaderOptions: {},
      messages: {},
    } as unknown as IntorInitConfig;
    expect(() =>
      validateSupportedLocales({
        config: config as IntorInitConfig,
        logger: mockLogger as unknown as IntorLogger,
      }),
    ).toThrow(IntorError);
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it("returns empty array when no supportedLocales or messages are provided", () => {
    const config = {
      id: "test",
    } as unknown as IntorInitConfig;
    const result = validateSupportedLocales({
      config,
      logger: mockLogger as unknown as IntorLogger,
    });
    expect(result).toEqual([]);
  });
});
