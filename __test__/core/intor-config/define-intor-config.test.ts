import type { IntorInitConfig } from "@/intor/core/intor-config/types/define-intor-config.types";
import { defineIntorConfig } from "@/intor/core/intor-config/define-intor-config";
import { resolveCookieOptions } from "@/intor/core/intor-config/resolvers/resolve-cookie-options";
import { resolveFallbackLocales } from "@/intor/core/intor-config/resolvers/resolve-fallback-locales";
import { resolveRoutingOptions } from "@/intor/core/intor-config/resolvers/resolve-routing-options";
import { resolveTranslatorOptions } from "@/intor/core/intor-config/resolvers/resolve-translator-options";
import { validateDefaultLocale } from "@/intor/core/intor-config/validations/validate-default-locale";
import { validateSupportedLocales } from "@/intor/core/intor-config/validations/validate-supported-locales";
import { getIntorLogger } from "@/intor/core/intor-logger/get-intor-logger";

jest.mock("@/intor/core/intor-logger/get-intor-logger", () => ({
  getIntorLogger: jest.fn(() => ({
    setLogPrefix: jest.fn(),
    setLevel: jest.fn(),
  })),
}));

jest.mock(
  "@/intor/core/intor-config/validations/validate-supported-locales",
  () => ({
    validateSupportedLocales: jest.fn(() => ["en", "zh"]),
  }),
);
jest.mock(
  "@/intor/core/intor-config/validations/validate-default-locale",
  () => ({
    validateDefaultLocale: jest.fn(() => "en"),
  }),
);
jest.mock(
  "@/intor/core/intor-config/resolvers/resolve-fallback-locales",
  () => ({
    resolveFallbackLocales: jest.fn(() => ({})),
  }),
);
jest.mock(
  "@/intor/core/intor-config/resolvers/resolve-translator-options",
  () => ({
    resolveTranslatorOptions: jest.fn(() => ({})),
  }),
);
jest.mock("@/intor/core/intor-config/resolvers/resolve-cookie-options", () => ({
  resolveCookieOptions: jest.fn(() => ({})),
}));
jest.mock(
  "@/intor/core/intor-config/resolvers/resolve-routing-options",
  () => ({
    resolveRoutingOptions: jest.fn(() => ({})),
  }),
);

describe("defineIntorConfig", () => {
  it("should generate config with provided id", () => {
    const config = {
      id: "TEST123",
      messages: {},
      translator: {},
      cookie: {},
      routing: {},
      adapter: "next-client",
      prefixPlaceHolder: "__INTOR__",
    };

    const result = defineIntorConfig(config as unknown as IntorInitConfig);

    expect(result.id).toBe("TEST123");
    expect(result.supportedLocales).toEqual(["en", "zh"]);
    expect(result.defaultLocale).toBe("en");
    expect(result.fallbackLocales).toEqual({});
    expect(result.prefixPlaceHolder).toBe("__INTOR__");
  });

  it("should generate config with random id if id is not provided", () => {
    const config = {
      messages: {},
      translator: {},
      cookie: {},
      routing: {},
    };

    const result = defineIntorConfig(config as unknown as IntorInitConfig);

    expect(result.id).toMatch(/^ID[a-z0-9]{4}$/); // Check pattern like IDxxxx
  });

  it("should call all resolver and validator functions", () => {
    const config = {
      messages: {},
      translator: {},
      cookie: {},
      routing: {},
    };

    defineIntorConfig(config as unknown as IntorInitConfig);

    expect(getIntorLogger).toHaveBeenCalled();
    expect(validateSupportedLocales).toHaveBeenCalled();
    expect(validateDefaultLocale).toHaveBeenCalled();
    expect(resolveFallbackLocales).toHaveBeenCalled();
    expect(resolveTranslatorOptions).toHaveBeenCalled();
    expect(resolveCookieOptions).toHaveBeenCalled();
    expect(resolveRoutingOptions).toHaveBeenCalled();
  });
});
