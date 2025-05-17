import type { IntorInitConfig } from "../../../../src/intor/core/intor-config/types/define-intor-config-types";
import { mockIntorLogger } from "../../../mock/mock-intor-logger";
import { validateSupportedLocales } from "../../../../src/intor/core/intor-config/validations/validate-supported-locales";
import { IntorError } from "../../../../src/intor/core/intor-error";

describe("validateSupportedLocales", () => {
  const { mockLogError, mockLogger } = mockIntorLogger();

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
      logger: mockLogger,
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
      logger: mockLogger,
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
        logger: mockLogger,
      }),
    ).toThrow(IntorError);
    expect(mockLogError).toHaveBeenCalled();
  });

  it("returns empty array when no supportedLocales or messages are provided", () => {
    const config = {
      id: "test",
    } as unknown as IntorInitConfig;
    const result = validateSupportedLocales({
      config,
      logger: mockLogger,
    });
    expect(result).toEqual([]);
  });
});
