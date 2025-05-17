import type { IntorAdapter } from "../../../src/intor/core/intor-config/types/intor-adapter-types";
import { DEFAULT_PREFIX_PLACEHOLDER } from "../../../src/intor/constants/prefix-placeholder-constants";
import { defineIntorConfig } from "../../../src/intor/core/intor-config/define-intor-config";
import { initializeLogger } from "../../../src/intor/core/intor-config/initialize-logger";
import { resolveCookieOptions } from "../../../src/intor/core/intor-config/resolvers/resolve-cookie-options";
import { resolveFallbackLocales } from "../../../src/intor/core/intor-config/resolvers/resolve-fallback-locales";
import { resolvePrefixPlaceholder } from "../../../src/intor/core/intor-config/resolvers/resolve-prefix-placeholder";
import { resolveRoutingOptions } from "../../../src/intor/core/intor-config/resolvers/resolve-routing-options";
import { resolveTranslatorOptions } from "../../../src/intor/core/intor-config/resolvers/resolve-translator-options";
import { validateDefaultLocale } from "../../../src/intor/core/intor-config/validations/validate-default-locale";
import { validateSupportedLocales } from "../../../src/intor/core/intor-config/validations/validate-supported-locales";

jest.mock(
  "../../../src/intor/core/intor-config/resolvers/resolve-cookie-options",
);
jest.mock(
  "../../../src/intor/core/intor-config/resolvers/resolve-fallback-locales",
);
jest.mock(
  "../../../src/intor/core/intor-config/resolvers/resolve-prefix-placeholder",
);
jest.mock(
  "../../../src/intor/core/intor-config/resolvers/resolve-routing-options",
);
jest.mock(
  "../../../src/intor/core/intor-config/resolvers/resolve-translator-options",
);
jest.mock(
  "../../../src/intor/core/intor-config/validations/validate-default-locale",
);
jest.mock(
  "../../../src/intor/core/intor-config/validations/validate-supported-locales",
);
jest.mock("../../../src/intor/core/intor-config/initialize-logger");

describe("defineIntorConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (validateSupportedLocales as jest.Mock).mockReturnValue(["en", "zh"]);
    (validateDefaultLocale as jest.Mock).mockReturnValue("en");
    (resolveFallbackLocales as jest.Mock).mockReturnValue({ en: ["zh"] });
    (resolveTranslatorOptions as jest.Mock).mockReturnValue({
      some: "translator",
    });
    (resolveCookieOptions as jest.Mock).mockReturnValue({ some: "cookie" });
    (resolveRoutingOptions as jest.Mock).mockReturnValue({ some: "routing" });
    (resolvePrefixPlaceholder as jest.Mock).mockReturnValue("i18n");
    (initializeLogger as jest.Mock).mockImplementation();
  });

  it("should resolve all config fields correctly", () => {
    const result = defineIntorConfig({
      messages: {},
      supportedLocales: ["en", "zh"],
      defaultLocale: "en",
      prefixPlaceHolder: "/i18n/",
    });

    expect(result).toMatchObject({
      id: expect.stringMatching(/^ID[a-z0-9]{4}$/),
      messages: {},
      defaultLocale: "en",
      supportedLocales: ["en", "zh"],
      fallbackLocales: { en: ["zh"] },
      translator: { some: "translator" },
      cookie: { some: "cookie" },
      routing: { some: "routing" },
      adapter: "next-client",
      prefixPlaceHolder: "i18n",
    });

    expect(resolvePrefixPlaceholder).toHaveBeenCalledWith("/i18n/");
    expect(resolveTranslatorOptions).toHaveBeenCalled();
    expect(resolveCookieOptions).toHaveBeenCalled();
    expect(resolveRoutingOptions).toHaveBeenCalled();
    expect(resolveFallbackLocales).toHaveBeenCalled();
    expect(initializeLogger).toHaveBeenCalledWith({
      id: expect.any(String),
      loggerOptions: undefined,
      prefix: "defineIntorConfig",
    });
  });

  it("should fallback to default prefix placeholder if none provided", () => {
    (resolvePrefixPlaceholder as jest.Mock).mockReturnValue(
      DEFAULT_PREFIX_PLACEHOLDER,
    );

    const result = defineIntorConfig({
      messages: {},
      supportedLocales: ["en"],
      defaultLocale: "en",
    });

    expect(resolvePrefixPlaceholder).toHaveBeenCalledWith(undefined);
    expect(result.prefixPlaceHolder).toBe(DEFAULT_PREFIX_PLACEHOLDER);
  });

  it("should use provided id if given", () => {
    const result = defineIntorConfig({
      id: "CUSTOM_ID",
      messages: {},
      supportedLocales: ["en"],
      defaultLocale: "en",
    });

    expect(result.id).toBe("CUSTOM_ID");
  });

  it("should use provided adapter if given", () => {
    const result = defineIntorConfig({
      adapter: "node" as IntorAdapter,
      messages: {},
      supportedLocales: ["en"],
      defaultLocale: "en",
    });

    expect(result.adapter).toBe("node");
  });

  it("should initialize logger with custom log level", () => {
    defineIntorConfig({
      logger: { level: "info" },
      messages: {},
      supportedLocales: ["en"],
      defaultLocale: "en",
    });

    expect(initializeLogger).toHaveBeenCalledWith({
      id: expect.any(String),
      loggerOptions: { level: "info" },
      prefix: "defineIntorConfig",
    });
  });

  it("should handle undefined optional fields (messages, loaderOptions)", () => {
    const result = defineIntorConfig({
      supportedLocales: ["en"],
      defaultLocale: "en",
    });

    expect(result.messages).toBeUndefined();
    expect(result.loaderOptions).toBeUndefined();
  });

  it("should throw if validateSupportedLocales fails", () => {
    (validateSupportedLocales as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid supported locales");
    });

    expect(() =>
      defineIntorConfig({
        messages: {},
        supportedLocales: ["xx"],
        defaultLocale: "en",
      }),
    ).toThrow("Invalid supported locales");
  });

  it("should preserve messages as-is", () => {
    const messages = {
      en: { greeting: "Hello" },
      zh: { greeting: "你好" },
    };

    const result = defineIntorConfig({
      messages,
      supportedLocales: ["en", "zh"],
      defaultLocale: "en",
    });

    expect(result.messages).toEqual(messages);
  });

  it("should use provided adapter if given", () => {
    const result = defineIntorConfig({
      adapter: "node" as IntorAdapter,
      messages: {},
      supportedLocales: ["en"],
      defaultLocale: "en",
    });

    expect(result.adapter).toBe("node");
  });
});
