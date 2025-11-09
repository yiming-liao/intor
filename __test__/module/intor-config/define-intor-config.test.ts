import { defineIntorConfig } from "@/modules/config";
import { DEFAULT_PREFIX_PLACEHOLDER } from "@/modules/config/constants/prefix-placeholder.constants";
import { resolveCookieOptions } from "@/modules/config/resolvers/resolve-cookie-options";
import { resolveFallbackLocales } from "@/modules/config/resolvers/resolve-fallback-locales";
import { resolvePrefixPlaceholder } from "@/modules/config/resolvers/resolve-prefix-placeholder";
import { resolveRoutingOptions } from "@/modules/config/resolvers/resolve-routing-options";
import { validateDefaultLocale } from "@/modules/config/validators/validate-default-locale";
import { validateSupportedLocales } from "@/modules/config/validators/validate-supported-locales";

jest.mock("@/modules/config/resolvers/resolve-cookie-options");
jest.mock("@/modules/config/resolvers/resolve-fallback-locales");
jest.mock("@/modules/config/resolvers/resolve-prefix-placeholder");
jest.mock("@/modules/config/resolvers/resolve-routing-options");
jest.mock("@/modules/config/validators/validate-default-locale");
jest.mock("@/modules/config/validators/validate-supported-locales");

describe("defineIntorConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (validateSupportedLocales as jest.Mock).mockReturnValue(["en", "zh"]);
    (validateDefaultLocale as jest.Mock).mockReturnValue("en");
    (resolveFallbackLocales as jest.Mock).mockReturnValue({ en: ["zh"] });
    (resolveCookieOptions as jest.Mock).mockReturnValue({ some: "cookie" });
    (resolveRoutingOptions as jest.Mock).mockReturnValue({ some: "routing" });
    (resolvePrefixPlaceholder as jest.Mock).mockReturnValue("i18n");
  });

  it("should resolve all config fields correctly", () => {
    const result = defineIntorConfig({
      messages: {},
      supportedLocales: ["en", "zh"],
      defaultLocale: "en",
      prefixPlaceHolder: "/i18n/",
      translator: { loadingMessage: "Loading...", placeholder: "MISSING" },
    });

    expect(result).toMatchObject({
      id: expect.stringMatching(/^ID[a-z0-9]{4}$/),
      messages: {},
      defaultLocale: "en",
      supportedLocales: ["en", "zh"],
      fallbackLocales: { en: ["zh"] },
      translator: { loadingMessage: "Loading...", placeholder: "MISSING" },
      cookie: { some: "cookie" },
      routing: { some: "routing" },
      prefixPlaceHolder: "i18n",
    });

    expect(resolvePrefixPlaceholder).toHaveBeenCalledWith("/i18n/");
    expect(resolveCookieOptions).toHaveBeenCalled();
    expect(resolveRoutingOptions).toHaveBeenCalled();
    expect(resolveFallbackLocales).toHaveBeenCalled();
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

  it("should initialize logger with custom log level", () => {
    defineIntorConfig({
      logger: { level: "info" },
      messages: {},
      supportedLocales: ["en"],
      defaultLocale: "en",
    });
  });

  it("should handle undefined optional fields (messages, loaderOptions)", () => {
    const result = defineIntorConfig({
      supportedLocales: ["en"],
      defaultLocale: "en",
    });

    expect(result.messages).toBeUndefined();
    expect(result.loader).toBeUndefined();
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
});
